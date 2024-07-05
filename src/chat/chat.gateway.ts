import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  OnGatewayDisconnect,
  WsException,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtSocketGuard } from 'src/guards/socket_guard/socket.guard';
import { UpdateMessageDto } from './dto/updateMessage.dto';
import {
  CHAT_TYPE,
  IS_READ,
  MEETING_STATUS,
  NOTIFICATION_TYPE,
  USER_ROLES,
} from 'src/constants';
import { GetRoomMessagesDto } from './dto/getMessage.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
import { ChatSessionManager } from './chat.session';
import { IsNull, Not, Repository } from 'typeorm';
import * as firebase from 'firebase-admin';
import { NotificationService } from 'src/notification/notification.service';
import { BroadcastMessageDto } from './dto/broadCastMessage.dto';
import { SendGroupMessageDto } from './dto/sendGroupMessage.dto';
import { JoinRoomDto } from './dto/joinRoom.dto';
import { GetRoomsDto } from './dto/getRooms.dto';
import { MarkReadDto } from './dto/markRead.dto';
import { DeleteMessageDto } from './dto/deleteMessage.dto';
import { GetRoomInfo } from './dto/getRoomInfo.dto';
import { PushNotifications } from 'src/database/entities/push_notifications.entity';
import { ChatMessages } from 'src/database/entities/chat_messages.entity';
import { Students } from 'src/database/entities/student.entity';
import { Users } from 'src/database/entities/user.entity';
import { UserDevice } from 'src/database/entities/user_devices.entity';

@WebSocketGateway({
  transports: ['websocket', 'polling'],
  cors: { origin: '*' },
  maxHttpBufferSize: 1024 * 1024 * 10, // 10mb
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private sessions: ChatSessionManager,
    private notificationService: NotificationService,
    @Inject('PUSH_NOTIFICATIONS_REPOSITORY')
    private readonly pushNotificationsRepository: Repository<PushNotifications>,
  ) { }
  @WebSocketServer() server: Server;

  /**
   * Handle connection
   * @param client
   */
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers?.authorization?.split(' ')[1];
      const user = await this.chatService.validateUser(token);
      this.sessions.setRoomDataOrUserSocket(user.id, client.id);
      client.emit('connected', 'User connected');
    } catch (error) {
      console.error('Error on handleConnection', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
    }
  }

  /**
   * Disconnect user and remove socket id from session as well as from table
   * @param client
   * @returns
   */
  async handleDisconnect(client: Socket) {
    try {
      const token = client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        throw new WsException('Unauthorized!');
      }
      const user = await this.chatService.validateUser(token);
      const sessionData = this.sessions.getUserSession(user.id);

      if (sessionData?.length && sessionData.indexOf(client.id) !== -1) {
        sessionData.splice(sessionData.indexOf(client.id), 1);
        if (sessionData?.length === 0) {
          this.sessions.removeUserKeyData(user.id);
          return;
        }
        this.sessions.setSession(user.id, [...new Set(sessionData)]);
      }
    } catch (error) {
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
    }
  }

  /**
   * Join all rooms of user
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('join-room')
  async joinRooms(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinRoomDto,
  ) {
    try {
      const userId = client.data.user.id;
      if (data?.room) {
        this.sessions.setRoomDataOrUserSocket(
          `joined_room_${userId}`,
          data.room,
        );
        await client.join(data.room);
      }
      client.emit('join-room');
    } catch (error) {
      console.error('error on joinRooms', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Create new message and create room between user if not exist
   * @param client
   * @param sendMessageDto
   * @returns
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('send-message')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ) {
    try {
      const userId = client.data.user.id;
      if (!sendMessageDto?.message || sendMessageDto?.message === '') {
        throw new WsException('Please enter message');
      }
      const message = await this.chatService.sendMessage(
        sendMessageDto.student_id,
        userId,
        sendMessageDto.receiver_id,
        sendMessageDto.message,
      );
      client.join(message.room_name);
      this.sessions.setRoomDataOrUserSocket(
        `joined_room_${userId}`,
        message.room_name,
      );
      let allSockets = [];
      const receiverUserSockets = this.sessions.getUserSession(
        sendMessageDto.receiver_id,
      );
      const senderUserSockets = this.sessions.getUserSession(userId);
      if (receiverUserSockets) {
        allSockets = [...allSockets, ...receiverUserSockets];
      }
      if (senderUserSockets) {
        allSockets = [...allSockets, ...senderUserSockets];
      }
      this.server.to(allSockets).emit('on-message', {
        message: message.message,
        temp_time: sendMessageDto.temp_time,
      });
      this.notificationService.sendNotification(message.sendNotificationData);
    } catch (error) {
      console.error('error on sendMessage', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Update message
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('update-message')
  async updateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateMessage: UpdateMessageDto,
  ) {
    try {
      const userId = client.data.user.id;
      const message = await this.chatService.updateMessage(
        updateMessage.message_id,
        updateMessage.message,
        userId,
      );
      let allSockets = [];
      const receiverUserSockets = this.sessions.getUserSession(
        message.receiver_id,
      );
      const senderUserSockets = this.sessions.getUserSession(message.sender_id);
      if (receiverUserSockets) {
        allSockets = [...allSockets, ...receiverUserSockets];
      }
      if (senderUserSockets) {
        allSockets = [...allSockets, ...senderUserSockets];
      }
      this.server.to(allSockets).emit('on-update-message', message);
      return message;
    } catch (error) {
      console.error('error on updateMessage', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Delete message of one to one chat
   * @param client
   * @param deleteMessage
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('delete-message')
  async deleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() deleteMessage: DeleteMessageDto,
  ) {
    try {
      const user = client.data.user;
      if (user.role != USER_ROLES.TEACHER) {
        throw new WsException('Unauthorized user!');
      }
      const { findMessage, returnMessage } =
        await this.chatService.deleteMessageOfOneToOneChat(
          deleteMessage.message_id,
          deleteMessage.room_id,
          user,
        );
      let allSockets = [];
      const senderUserSockets = this.sessions.getUserSession(
        findMessage.sender_id,
      );

      const receiverUserSockets = this.sessions.getUserSession(
        findMessage.receiver_id,
      );
      if (receiverUserSockets) {
        allSockets = [...allSockets, ...receiverUserSockets];
      }
      if (senderUserSockets) {
        allSockets = [...allSockets, ...senderUserSockets];
      }
      this.server.to(allSockets).emit('on-delete-message', {
        last_message: returnMessage,
        ...deleteMessage,
      });
    } catch (error) {
      console.error('error on deleteMessage', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Get all one to one rooms of particular user to show in chat page
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('get-rooms')
  async getRooms(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GetRoomsDto,
  ) {
    try {
      const userRole = client.data.user.role;
      const rooms = await this.chatService.getAllRoomsAsPerUser(
        userRole !== USER_ROLES.PARENT ? undefined : data?.student_id,
        client.data.user.id,
        data?.search,
        userRole,
        data?.page,
        data?.page_size,
      );
      client.emit('get-rooms', {
        ...rooms,
        ...(data &&
          data?.search &&
          data?.search != '' && { search: data.search }),
      });
    } catch (error) {
      console.error('error on getRooms', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Get room messages
   * @param client
   * @param getMessage
   * @returns
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('get-messages')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() getMessage: GetRoomMessagesDto,
  ) {
    try {
      const getRoomMessages = await this.chatService.getMessagesOfRoom(
        getMessage.room_id,
        getMessage.page,
        getMessage.page_size,
      );
      client.emit('get-messages', {
        messages: getRoomMessages.messages,
        total: getRoomMessages.total,
        room_id: getMessage.room_id,
      });
    } catch (error) {
      console.error('error on getMessages', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * read message event
   * @param client
   * @param getMessage
   * @returns
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('mark-read')
  async readMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: MarkReadDto,
  ) {
    try {
      const userId = client.data.user.id;
      await this.chatService.updateChatMessage(
        {
          receiver_id: userId,
          chat_room_id: data.room_id,
        },
        { is_read: IS_READ.TRUE },
      );
      const userSockets = this.sessions.getUserSession(userId);
      this.server.to(userSockets).emit('mark-read', { room_id: data.room_id });
    } catch (error) {
      console.error('error on readMessages', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Leave room by room name
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('leave-room')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { room: string },
  ) {
    try {
      const userId = client.data.user.id;
      await client.leave(data.room);
      const sessionData = this.sessions.getUserSession(`joined_room_${userId}`);
      if (sessionData?.length && sessionData.indexOf(data.room) !== -1) {
        sessionData.splice(sessionData.indexOf(data.room), 1);
        if (sessionData?.length === 0) {
          this.sessions.removeUserKeyData(`joined_room_${userId}`);
          return;
        }
        this.sessions.setSession(`joined_room_${userId}`, [
          ...new Set(sessionData),
        ]);
      }
    } catch (error) {
      console.error('error on leaveRoom', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Get all group of user with pagination
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('get-groups')
  async getUsersGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { page: number; page_size: number; search?: string },
  ) {
    try {
      const userId = client.data.user.id;
      const groups = await this.chatService.getUserGroups(
        userId,
        data?.page,
        data?.page_size,
        data?.search,
      );
      client.emit('get-groups', {
        ...groups,
        ...(data &&
          data?.search &&
          data?.search != '' && { search: data.search }),
      });
      return groups;
    } catch (error) {
      console.error('error on getUsersGroup', error);
      client.emit('on-error', {
        message: error?.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Send group message
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('send-group-message')
  async sendMessageToGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: SendGroupMessageDto,
  ) {
    try {
      const userId = client.data.user.id;
      const room = await this.chatService.findRoom({
        id: data.room_id,
        school_id: Not(IsNull()) as any,
      });
      if (!room) {
        throw new WsException('Room not found');
      }
      const message = await this.chatService.sendMessageToGroupMembers(
        data.room_id,
        data.message,
        userId,
      );
      const groupWithLastMessage: any = await (
        await this.chatService.queryToGetGroupsByIds([data.room_id], message.id)
      ).getOne();
      const groupMembersIds = await this.chatService.getAllMembersOfGroup(
        data.room_id,
        undefined,
      );
      const userDevices =
        await this.chatService.findUserDevices(groupMembersIds);
      let allAserSockets = [];
      groupMembersIds.forEach((memberUserId: number) => {
        const socketIds = this.sessions.getUserSession(memberUserId);
        if (socketIds) {
          allAserSockets = [...allAserSockets, ...socketIds];
        }
      });
      this.server.to(allAserSockets).emit('on-group-message', {
        message: groupWithLastMessage,
        temp_time: data?.temp_time,
      });

      const notificationData = [];
      userDevices.forEach((device) => {
        const notification: firebase.messaging.Message = {
          token: device.device_token,
          notification: {
            body: groupWithLastMessage.group_messages.message,
            title: groupWithLastMessage?.school?.name,
          },
          data: {
            notificationMessage: JSON.stringify(groupWithLastMessage),
            type: CHAT_TYPE.GROUP_CHAT,
            notification_type: NOTIFICATION_TYPE.CHAT,
          },
        };
        notificationData.push(notification);
      });
      await this.notificationService.sendNotification(notificationData);

      for await (const memberUserId of groupMembersIds) {
        if (userId != memberUserId) {
          await this.pushNotificationsRepository.save({
            type: NOTIFICATION_TYPE.CHAT,
            title: `You have a new message from ${groupWithLastMessage?.school?.name}`,
            body: JSON.stringify(groupWithLastMessage),
            from_user_id: userId,
            to_user_id: memberUserId,
            description: groupWithLastMessage.group_messages.message,
          });
        }
      }
    } catch (error) {
      console.error('error on sendMessageToGroup', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Get group message with pagination
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('get-group-message')
  async getGroupMessageById(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GetRoomMessagesDto,
  ) {
    try {
      const getGroupMessage = await this.chatService.groupMessage(
        data.room_id,
        data.page,
        data.page_size,
      );
      client.emit('get-group-message', {
        ...getGroupMessage,
        group_id: data.room_id,
      });
    } catch (error) {
      console.error('Error on getGroupMessageById', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Mark read group message
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('mark-read-group')
  async markReadGroupMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: MarkReadDto,
  ) {
    try {
      const userId = client.data.user.id;
      await this.chatService.updateGroupMessageReceivers(
        { receiver_id: userId, chat_room_id: data.room_id },
        { is_read: IS_READ.TRUE },
      );
      const userSockets = this.sessions.getUserSession(userId);
      this.server
        .to(userSockets)
        .emit('mark-read-group', { room_id: data.room_id });
    } catch (error) {
      console.error('Error on markReadGroupMessage', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Mark read group message
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('update-group-message')
  async updateGroupMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UpdateMessageDto,
  ) {
    try {
      const userId = client.data.user.id;
      const message = await this.chatService.updateGroupMessage(
        userId,
        data.message_id,
        data.message,
      );
      this.server
        .to(message.chat_room.room)
        .emit('on-update-group-message', message);
    } catch (error) {
      console.error('Error on updateGroupMessage', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Broadcast one to one message(to multiple parents) from teacher side
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('broadcast-message')
  async broadcastMessageToParentsFromTeacher(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: BroadcastMessageDto,
  ) {
    try {
      if (!data?.message || data?.message === '') {
        throw new WsException('Please enter message');
      }
      const senderUser = client.data.user;
      const userRole = client.data.user.role;
      if (userRole !== USER_ROLES.TEACHER) {
        throw new WsException('Unauthorized user!');
      }
      await this.chatService.makeBroadCastMessage(
        data,
        senderUser,
        this.server,
      );
    } catch (error) {
      console.error('Error on broadcastMessageToParentsFromTeacher', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * Get room info
   * @param client
   * @param data
   */
  @UseGuards(JwtSocketGuard)
  @SubscribeMessage('get-room-info')
  async getRoomInfo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GetRoomInfo,
  ) {
    try {
      const userId = client.data.user.id;
      if (!data?.receiver_id) {
        throw new WsException('Invalid chat selection');
      }
      const roomInfo = await this.chatService.getRoomInfo(
        userId,
        data?.receiver_id,
        data?.student_id,
      );
      client.emit('on-get-room-info', roomInfo);
    } catch (error) {
      console.error('Error on getRoomInfo', error);
      client.emit('on-error', {
        message: error.message ? error.message : 'Unauthorized!',
      });
      throw new WsException(error);
    }
  }

  /**
   * send meeting message
   * @param room_id
   * @param room_name
   * @param student
   * @param sender_user
   * @param receiver_user
   * @param message
   */
  async sendMeetingMessage(
    room_id: number,
    room_name: string,
    student: Students,
    sender_user: Partial<Users>,
    receiver_user: Users,
    message: ChatMessages | null,
    is_approved: number,
  ) {
    const returnMessage = await this.chatService.createReturnMessage(
      room_id,
      room_name,
      student,
      sender_user,
      receiver_user,
      message,
    );
    let bodyMessage = `You have meeting invitation from ${sender_user.firstname} ${sender_user.lastname}`;
    let title = `Message from ${sender_user.firstname} ${sender_user.lastname}`;
    if (is_approved && is_approved === MEETING_STATUS.APPROVED) {
      bodyMessage = `Your meeting invitation has been approved by ${receiver_user.firstname} ${receiver_user.lastname}`;
      title = `Message from ${receiver_user.firstname} ${receiver_user.lastname}`;
    }
    if (is_approved && is_approved === MEETING_STATUS.REJECTED) {
      bodyMessage = `Your meeting invitation has been rejected by ${receiver_user.firstname} ${receiver_user.lastname}`;
      title = `Message from ${receiver_user.firstname} ${receiver_user.lastname}`;
    }
    if (is_approved && is_approved === MEETING_STATUS.EXPIRED) {
      bodyMessage = `Your meeting invitation has been expired with ${receiver_user.firstname} ${receiver_user.lastname}`;
      title = `Message from ${receiver_user.firstname} ${receiver_user.lastname}`;
    }
    let allSockets = [];
    const receiverUserSockets = this.sessions.getUserSession(receiver_user.id);
    const senderUserSockets = this.sessions.getUserSession(sender_user.id);
    if (receiverUserSockets) {
      allSockets = [...allSockets, ...receiverUserSockets];
    }
    if (senderUserSockets) {
      allSockets = [...allSockets, ...senderUserSockets];
    }
    if (is_approved === undefined) {
      this.server.to(allSockets).emit('on-message', {
        message: returnMessage,
      });
    }
    const updateMessage = {
      id: message.id,
      chat_rooms: message.chat_rooms,
      is_read: message.is_read,
      is_approved: message.is_approved,
      chat_room_id: message.chat_room_id,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt,
      is_sent: message.is_sent,
      message: message.message,
      message_type: message.message_type,
      receiver_id: message.receiver_id,
      sender_id: message.sender_id,
      student_id: message.student_id,
    };
    if (is_approved) {
      this.server.to(allSockets).emit('on-update-message', updateMessage);
    }
    let userDeviceFindId = sender_user.id;
    if (is_approved === undefined) {
      userDeviceFindId = receiver_user.id;
    }
    const receiverUserDevices = await this.chatService.findUserDevices([
      userDeviceFindId,
    ]);
    await this.pushNotificationsRepository.save({
      type: NOTIFICATION_TYPE.ZOOM_MEETINGS,
      title: title,
      body: JSON.stringify({
        status: message.is_approved,
        date: message.message,
      }),
      from_user_id: receiver_user.id,
      to_user_id: sender_user.id,
      description: bodyMessage,
    });
    const sendNotificationData = receiverUserDevices.map(
      (userDevice: UserDevice) => {
        const notificationData: firebase.messaging.Message = {
          token: userDevice.device_token,
          notification: {
            body: bodyMessage,
            title: title,
          },
          data: {
            notificationMessage: JSON.stringify({
              status: message.is_approved,
              date: message.message,
            }),
            notification_type: NOTIFICATION_TYPE.ZOOM_MEETINGS,
            user_role: receiver_user.role.toString(),
          },
        };
        return notificationData;
      },
    );
    this.notificationService.sendNotification(sendNotificationData);
  }

  /**
   * Reject meeting of chat messages
   * @param chatMessageIds
   */
  async rejectPendingMeetingStatus(chatMessageIds: number[]) {
    const bodyMessage = 'Your meeting invitation has been rejected by';
    const title = 'Message from';
    for await (const message_id of chatMessageIds) {
      const message = await this.chatService.findChatMessage({
        id: message_id,
      });
      const senderUserSockets = this.sessions.getUserSession(message.sender_id);
      const receiverUserSockets = this.sessions.getUserSession(
        message.receiver_id,
      );
      const allSockets = [...senderUserSockets, ...receiverUserSockets];

      const senderUserDevices = await this.chatService.findUserDevices([
        message.sender_id,
      ]);
      await this.pushNotificationsRepository.save({
        type: NOTIFICATION_TYPE.ZOOM_MEETINGS,
        title: title.concat(
          ` ${message.receiver_user.firstname} ${message.receiver_user.lastname}`,
        ),
        body: JSON.stringify({
          status: message.is_approved,
          date: message.message,
        }),
        from_user_id: message.receiver_id,
        to_user_id: message.sender_id,
        description: bodyMessage.concat(
          ` ${message.receiver_user.firstname} ${message.receiver_user.lastname}`,
        ),
      });
      const updateMessage = {
        id: message.id,
        chat_rooms: message.chat_rooms,
        is_read: message.is_read,
        is_approved: message.is_approved,
        chat_room_id: message.chat_room_id,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        deletedAt: message.deletedAt,
        is_sent: message.is_sent,
        message: message.message,
        message_type: message.message_type,
        receiver_id: message.receiver_id,
        sender_id: message.sender_id,
        student_id: message.student_id,
      };
      this.server.to(allSockets).emit('on-update-message', updateMessage);
      const sendNotificationData = senderUserDevices.map(
        (userDevice: UserDevice) => {
          const notificationData: firebase.messaging.Message = {
            token: userDevice.device_token,
            notification: {
              body: bodyMessage,
              title: title,
            },
            data: {
              notificationMessage: JSON.stringify({
                status: message.is_approved,
                date: message.message,
              }),
              notification_type: NOTIFICATION_TYPE.ZOOM_MEETINGS,
              user_role: message.sender_user.role.toString(),
            },
          };
          return notificationData;
        },
      );
      this.notificationService.sendNotification(sendNotificationData);
    }
  }
}
