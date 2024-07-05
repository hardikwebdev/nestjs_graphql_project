import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatMessages } from 'src/database/entities/chat_messages.entity';
import { ChatRooms } from 'src/database/entities/chat_room.entity';
import { Users } from 'src/database/entities/user.entity';
import { In, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { Students } from 'src/database/entities/student.entity';
import { HelperService } from 'src/helper.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import {
  CHAT_FEATURE,
  CHAT_TYPE,
  IS_READ,
  NOTIFICATION_TYPE,
  STATUS,
  USER_ROLES,
} from 'src/constants';
import { AwsService } from 'src/aws/aws.service';
import { JwtService } from '@nestjs/jwt';
import * as firebase from 'firebase-admin';
import { UserDevice } from 'src/database/entities/user_devices.entity';
import { GroupMembers } from 'src/database/entities/group_members.entity';
import { GroupMessages } from 'src/database/entities/group_message.entity';
import { CreateGroupMessageDto } from './dto/createGroupMessage.dto';
import { GroupMessagesReceivers } from 'src/database/entities/group_message_receiver.entity';
import { BroadcastMessageDto } from './dto/broadCastMessage.dto';
import { Server } from 'socket.io';
import { ChatSessionManager } from './chat.session';
import { PushNotifications } from 'src/database/entities/push_notifications.entity';

@Injectable()
export class ChatService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRespository: Repository<Users>,
    @Inject('CHAT_ROOM_REPOSITORY')
    private readonly chatRoomRepository: Repository<ChatRooms>,
    @Inject('CHAT_MESSAGE_REPOSITORY')
    private readonly chatMessageRepository: Repository<ChatMessages>,
    @Inject('STUDENTS_REPOSITORY')
    private readonly studentRepository: Repository<Students>,
    @Inject('USER_DEVICE_REPOSITORY')
    private readonly userDeviceRepository: Repository<UserDevice>,
    @Inject('GROUP_MEMBERS_REPOSITORY')
    private readonly groupMembersRepository: Repository<GroupMembers>,
    @Inject('GROUP_MESSAGE_REPOSITORY')
    private readonly groupMessageRepository: Repository<GroupMessages>,
    @Inject('GROUP_MESSAGE_RECEIVERS_REPOSITORY')
    private readonly groupMessageReceiverRepository: Repository<GroupMessagesReceivers>,
    @Inject('PUSH_NOTIFICATIONS_REPOSITORY')
    private readonly pushNotificationsRepository: Repository<PushNotifications>,
    private readonly helperService: HelperService,
    private readonly awsService: AwsService,
    private readonly jwtService: JwtService,
    private sessions: ChatSessionManager,
  ) { }

  /**
   * Find user by data
   * @param findData
   * @returns
   */
  async findUser(findData: any) {
    return await this.userRespository.findOne({
      where: findData,
      select: ['id', 'role', 'firstname', 'lastname', 'profile_img'],
    });
  }

  /**
   * Find message
   * @param findData
   * @returns
   */
  async findChatMessage(findData: any) {
    return await this.chatMessageRepository.findOne({
      where: findData,
      relations: {
        chat_rooms: true,
        receiver_user: true,
        sender_user: true,
        student: true,
      },
    });
  }

  /**
   * Update user data
   * @param updateBy
   * @param updateData
   * @returns
   */
  async updateUser(updateBy: any, updateData: Partial<Users>) {
    return await this.userRespository.update(updateBy, updateData);
  }

  /**
   * Get room by sender_id or receiver_id and student_id
   * @param user_one_id
   * @param user_two_id
   * @param student_id
   * @returns
   */
  async getRoom(user_one_id: number, user_two_id: number, student_id: number) {
    const roomData = await this.chatMessageRepository.findOne({
      where: [
        {
          receiver_id: user_one_id,
          sender_id: user_two_id,
          ...(student_id && student_id !== undefined && { student_id }),
        },
        {
          sender_id: user_one_id,
          ...(student_id && student_id !== undefined && { student_id }),
          receiver_id: user_two_id,
        },
      ],
      relations: {
        chat_rooms: true,
      },
    });
    return roomData;
  }

  /**
   * Find student by id
   * @param student_id
   * @param sender_id
   * @param receiver_id
   * @returns
   */
  async findStudent(
    student_id: number,
    sender_id: number,
    receiver_id: number,
  ) {
    try {
      const student = await this.studentRepository.findOne({
        where: [
          {
            id: student_id,
            parent_id: sender_id,
            status: STATUS.ACTIVE,
          },
          {
            id: student_id,
            parent_id: receiver_id,
            status: STATUS.ACTIVE,
          },
        ],
      });
      if (!student) {
        throw new WsException('Student not found!');
      }
      return student;
    } catch (error) {
      throw new WsException(error);
    }
  }

  /**
   * create or find room and send message
   * @param student_id
   * @param sender_id
   * @param receiver_id
   */
  async sendMessage(
    student_id: number,
    sender_id: number,
    receiver_id: number,
    message: string,
  ) {
    try {
      const sender_user = await this.findUser({
        id: sender_id,
        chat_feature: CHAT_FEATURE.ENABLE,
      });
      const receiver_user = await this.findUser({
        id: receiver_id,
        chat_feature: CHAT_FEATURE.ENABLE,
      });
      if (
        !sender_user ||
        !receiver_user ||
        sender_user.role === receiver_user.role
      ) {
        throw new WsException('Invalid chat selection!');
      }
      await this.findStudent(student_id, sender_id, receiver_id);
      const roomData = await this.getRoom(sender_id, receiver_id, student_id);
      let room_id = roomData?.chat_room_id;
      let room_name = roomData?.chat_rooms?.room;
      if (!room_id) {
        const { id, room } = await this.findOrCreateRoom(
          sender_id,
          receiver_id,
          student_id,
        );
        room_id = id;
        room_name = room;
      }
      let message_type = 'text';
      
      let userMessage = message;
      const messageType = this.helperService.isBase64(message);
      if (messageType) {
        message_type = messageType.type;
        const { Location } = await this.awsService.uploadToAWS(
          `chat_${message_type}`,
          message,
          'message',
        );
        userMessage = Location;
      }
      const createMessage = await this.createMessage({
        sender_id,
        receiver_id,
        student_id,
        message: userMessage,
        chat_room_id: room_id,
        message_type,
      });
      const receiverUserDevices = await this.findUserDevices([receiver_id]);
      const notificationMessage = await (
        await this.queryToFindRoomsByIds([room_id], createMessage.id)
      ).getOne();
      let sendNotificationData = [];
      if (receiverUserDevices?.length) {
        sendNotificationData = receiverUserDevices.map(
          (userDevice: UserDevice) => {
            const notificationData: firebase.messaging.Message = {
              token: userDevice.device_token,
              notification: {
                body: createMessage.message,
                title: `Message from ${sender_user.firstname} ${sender_user.lastname}`,
              },
              data: {
                notificationMessage: JSON.stringify(notificationMessage),
                type: CHAT_TYPE.ONETOONE,
                notification_type: NOTIFICATION_TYPE.CHAT,
                user_role: receiver_user.role.toString(),
              },
            };
            return notificationData;
          },
        );
      }
      await this.pushNotificationsRepository.save({
        type: NOTIFICATION_TYPE.CHAT,
        title: `You have a new message from ${sender_user.firstname} ${sender_user.lastname}`,
        body: JSON.stringify(notificationMessage),
        from_user_id: sender_user.id,
        to_user_id: receiver_id,
        description: createMessage.message,
      });
      return { room_name, message: notificationMessage, sendNotificationData };
    } catch (error) {
      throw new WsException(error);
    }
  }

  /**
   * Update message
   * @param message_id
   * @param message
   */
  async updateMessage(message_id: number, message: string, sender_id: number) {
    try {
      await this.updateChatMessage(
        { id: message_id, sender_id },
        { message, is_read: IS_READ.FALSE },
      );
      const findMessage = await this.findChatMessage({ id: message_id });
      if (!findMessage) {
        throw new WsException('Message Not Found!');
      }
      return findMessage;
    } catch (error) {
      throw new WsException(error);
    }
  }

  /**
   * create room for one to one chat
   * @param sender_id
   * @param receiver_id
   * @param student_id
   * @returns
   */
  async findOrCreateRoom(
    sender_id: number,
    receiver_id: number,
    student_id: number,
  ) {
    const findRoom = await this.chatRoomRepository.findOne({
      where: [
        {
          room_users: JSON.stringify([
            sender_id,
            receiver_id,
            ...(student_id && student_id !== undefined && [student_id]),
          ]),
        },
        {
          room_users: JSON.stringify([
            receiver_id,
            sender_id,
            ...(student_id && student_id !== undefined && [student_id]),
          ]),
        },
      ],
    });
    if (findRoom) {
      return findRoom;
    }
    const roomString = `${sender_id}${receiver_id}`;
    if (student_id && student_id !== undefined) {
      roomString.concat(`${student_id}`);
    }
    const roomName = this.helperService.passwordHash(roomString);
    return await this.chatRoomRepository.save({
      room: roomName,
      room_users: JSON.stringify([
        sender_id,
        receiver_id,
        ...(student_id && student_id !== undefined && [student_id]),
      ]),
    });
  }

  /**
   * create one to one message
   * @param createMessageData
   * @returns
   */
  async createMessage(createMessageData: CreateMessageDto) {
    const currentTime = new Date().toISOString();
    return await this.chatMessageRepository.save({
      ...createMessageData,
      createdAt: currentTime,
      updatedAt: currentTime,
    });
  }

  /**
   * create group message
   * @param createMessageData
   * @returns
   */
  async createGroupMessage(createGroupMessage: CreateGroupMessageDto) {
    const currentTime = new Date().toISOString();
    return await this.groupMessageRepository.save({
      ...createGroupMessage,
      createdAt: currentTime,
      updatedAt: currentTime,
    });
  }

  /**
   * Get all rooms as per user and get last message
   * @param student_id
   * @param user_id
   * @returns
   */
  async getAllRoomsAsPerUser(
    student_id: number,
    user_id: number,
    search: string,
    role: number,
    page: number = 1,
    page_size: number = 25,
  ) {
    try {
      const skip = (page - 1) * page_size;
      const chatRoomNameAndIds = await this.getUsersChatRoomIdsAndName(
        student_id,
        user_id,
      );
      const chatRoomIds: number[] = [];
      chatRoomNameAndIds.forEach((chatRoom: { chat_room_id: number }) => {
        chatRoomIds.push(chatRoom.chat_room_id);
      });
      if (chatRoomIds.length === 0) {
        return { total: 0, chats: [] };
      }
      const query = await this.queryToFindRoomsByIds(chatRoomIds, undefined);
      if (search !== undefined && search !== '') {
        query.andWhere(
          `(
            (CONCAT(receiver_users.firstname, " ", receiver_users.lastname) LIKE :search 
                AND receiver_users.id != :user_id) 
            OR 
            (CONCAT(sender_users.firstname, " ", sender_users.lastname) LIKE :search 
                AND sender_users.id != :user_id) 
        )`,
          {
            search: `%${search}%`,
            user_id: user_id,
          },
        );
        if (role !== USER_ROLES.PARENT) {
          query.orWhere(
            `(CONCAT(students.firstname, " ", students.lastname) LIKE :search)`,
            {
              search: `%${search}%`,
            },
          );
        }
      }

      const [findChatRooms, total] = await query
        .skip(skip)
        .take(page_size)
        .getManyAndCount();
      const roomDataWithUnreadCount = await Promise.all(
        findChatRooms.map(async (room_data: ChatRooms) => {
          const unreadCount = await this.chatMessageRepository.count({
            where: {
              receiver_id: user_id,
              chat_room_id: room_data.id,
              is_read: IS_READ.FALSE,
            },
          });
          room_data['unreadCount'] = unreadCount;
          return room_data;
        }),
      );
      return { chats: roomDataWithUnreadCount, total };
    } catch (error) {
      throw new WsException(error);
    }
  }

  /**
   * All joined one to one room Ids of user as per student
   * @param student_id
   * @param user_id
   * @returns number[]
   */
  async getUsersChatRoomIdsAndName(
    student_id: number,
    user_id: number,
  ): Promise<{ chat_room_id: number; room: string }[]> {
    try {
      const chatRoomsData: SelectQueryBuilder<ChatMessages> =
        this.chatMessageRepository
          .createQueryBuilder('chat_messages')
          .leftJoin('chat_messages.chat_rooms', 'chat_room')
          .where('(chat_messages.sender_id = :sender_id)', {
            sender_id: user_id,
          })
          .orWhere('(chat_messages.receiver_id = :receiver_id)', {
            receiver_id: user_id,
          });
      if (student_id !== undefined) {
        chatRoomsData.where('(chat_messages.student_id = :student_id)', {
          student_id,
        });
      }
      chatRoomsData.andWhere('(chat_room.school_id is NULL)');
      chatRoomsData
        .select(['chat_room_id', 'room'])
        .groupBy('chat_messages.chat_room_id');
      const chatRoomNameAndIds: any = await chatRoomsData.execute();
      return chatRoomNameAndIds;
    } catch (error) {
      console.error('Error on getUsersChatRoomIdsForUser', error);
      throw new WsException(error);
    }
  }

  /**
   * Get messages with pagination by id
   * @param room_id
   * @param page
   * @param page_size
   * @returns
   */
  async getMessagesOfRoom(room_id: number, page = 1, page_size = 10) {
    try {
      const skip = (page - 1) * page_size;
      const queryBuilder: SelectQueryBuilder<ChatMessages> =
        this.chatMessageRepository
          .createQueryBuilder('chat_message')
          .where('(chat_message.chat_room_id = :room_id)', {
            room_id,
          })
          .leftJoinAndMapOne(
            'chat_message.student',
            'Students',
            'students',
            'students.id = chat_message.student_id',
          )
          .leftJoinAndMapOne(
            'chat_message.receiver_user',
            'users',
            'receiver_users',
            'receiver_users.id = chat_message.receiver_id',
          )
          .leftJoinAndMapOne(
            'chat_message.sender_user',
            'users',
            'sender_users',
            'sender_users.id = chat_message.sender_id',
          )
          .select([
            'chat_message.id',
            'chat_message.message',
            'chat_message.message_type',
            'chat_message.is_read',
            'chat_message.is_approved',
            'chat_message.chat_room_id',
            'chat_message.createdAt',
            'chat_message.updatedAt',
            'receiver_users.id',
            'receiver_users.firstname',
            'receiver_users.lastname',
            'receiver_users.profile_img',
            'receiver_users.role',
            'sender_users.id',
            'sender_users.firstname',
            'sender_users.lastname',
            'sender_users.profile_img',
            'sender_users.role',
            'students.firstname',
            'students.lastname',
            'students.id',
            'students.profile_img',
          ])
          .skip(skip)
          .take(page_size)
          .orderBy(`chat_message.createdAt`, 'DESC');

      const [messages, total] = await queryBuilder.getManyAndCount();
      return { messages, total };
    } catch (error) {
      throw new WsException(error);
    }
  }

  /**
   * update message
   * @param whereOption
   * @param updateData
   * @returns
   */
  async updateChatMessage(whereOption: any, updateData: Partial<ChatMessages>) {
    try {
      return await this.chatMessageRepository.update(whereOption, updateData);
    } catch (error) {
      throw new WsException(error);
    }
  }

  /**
   * Validate user
   * @param token
   * @returns
   */
  async validateUser(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        ignoreExpiration: false,
        secret:
          process.env.JWT_SCERET_KEY ||
          '3KfcgMUJSDFNhasreHJBXCAUuiqwerksac45rknsdfKJSBF',
      });
      if (!payload || !payload.email) {
        throw new WsException('Unauthorized user!');
      }
      const userData = await this.findUser({ email: payload.email });
      delete userData.password;
      return userData;
    } catch (error) {
      console.error('Error on validateUser', error);
      throw new WsException(error);
    }
  }

  /**
   * find user devices
   * @param userId
   * @returns
   */
  async findUserDevices(userIds: number[]) {
    try {
      const userDevices = await this.userDeviceRepository.find({
        where: {
          user_id: In(userIds),
        },
        select: ['device_token', 'device_type'],
      });
      return userDevices;
    } catch (error) {
      console.error('Error on findUserDevices', error);
      throw new WsException(error);
    }
  }

  /**
   * Get user groups
   * @param userId
   * @returns
   */
  async getUserGroups(
    user_id: number,
    page = 1,
    page_size = 25,
    search: string,
  ) {
    try {
      const skip = (page - 1) * page_size;
      const userRooms = await this.getUsersJoinedGroupRoomIds(user_id);
      const room_ids = userRooms.map((groupMember) => groupMember.chat_room_id);
      if (room_ids.length === 0) {
        return { group: [], total: 0 };
      }
      const query = await this.queryToGetGroupsByIds(room_ids, undefined);
      if (search && search !== '') {
        query.andWhere('(school.name LIKE :search)', {
          search: `%${search}%`,
        });
      }
      const [userGroup, total] = await query
        .skip(skip)
        .take(page_size)
        .getManyAndCount();
      const roomDataWithUnreadCount = await Promise.all(
        userGroup.map(async (room_data) => {
          const unreadCount = await this.groupMessageReceiverRepository.count({
            where: {
              receiver_id: user_id,
              chat_room_id: room_data.id,
              is_read: IS_READ.FALSE,
            },
          });
          room_data['unreadCount'] = unreadCount;
          return room_data;
        }),
      );
      return { group: roomDataWithUnreadCount, total };
    } catch (error) {
      console.error('Error on getUserGroups', error);
      throw new WsException(error);
    }
  }

  /**
   * send message to group members
   * @param room_id
   * @param message
   * @param sender_id
   * @returns
   */
  async sendMessageToGroupMembers(
    room_id: number,
    message: string,
    sender_id: number,
  ) {
    try {
      const memberExist = await this.findGroupMember({
        chat_room_id: room_id,
        user_id: sender_id,
      });
      if (!memberExist) {
        throw new WsException('Member does not exist in this group!');
      }
      let message_type = 'text';
      let userMessage = message;
      const messageType = this.helperService.isBase64(message);
      if (messageType) {
        message_type = messageType.type;
        const { Location } = await this.awsService.uploadToAWS(
          `chat_${message_type}`,
          message,
          'message',
        );
        userMessage = Location;
      }
      const createGroupMessage = await this.createGroupMessage({
        chat_room_id: room_id,
        message: userMessage,
        message_type,
        sender_id,
      });
      const groupMembersIds = await this.getAllMembersOfGroup(
        room_id,
        sender_id,
      );
      const receiverMessageData = groupMembersIds.map((receiver_id: number) => {
        const receiverUserData = { receiver_id, chat_room_id: room_id };
        receiverUserData['group_message_id'] = createGroupMessage.id;
        return receiverUserData;
      });
      await this.groupMessageReceiverRepository.save(receiverMessageData);
      return createGroupMessage;
    } catch (error) {
      console.error('Error on sendMessageToGroupMembers', error);
      throw new WsException(error);
    }
  }

  /**
   * Get userIds of group members by room id (excluding sender's userid)
   * @param room_id
   * @param sender_id
   * @returns
   */
  async getAllMembersOfGroup(room_id: number, sender_id: number) {
    try {
      const members = await this.groupMembersRepository.find({
        where: {
          chat_room_id: room_id,
          ...(sender_id && { user_id: Not(sender_id) }),
        },
        select: ['user_id', 'id'],
      });
      const userIds = members.map((item) => item.user_id);
      return userIds;
    } catch (error) {
      console.error('Error on getAllMembersOfGroup', error);
      throw new WsException(error);
    }
  }

  /**
   * Get group message with pagination
   * @param room_id
   * @param page
   * @param page_size
   * @returns
   */
  async groupMessage(room_id: number, page = 1, page_size = 10) {
    try {
      const skip = (page - 1) * page_size;
      const queryBuilder: SelectQueryBuilder<GroupMessages> =
        this.groupMessageRepository
          .createQueryBuilder('group_message')
          .leftJoinAndSelect('group_message.user', 'user')
          .where('(group_message.chat_room_id = :room_id)', {
            room_id,
          })
          .skip(skip)
          .take(page_size)
          .orderBy(`group_message.createdAt`, 'DESC')
          .select([
            'group_message',
            'user.id',
            'user.firstname',
            'user.lastname',
            'user.email',
            'user.role',
            'user.profile_img',
          ]);
      const [messages, total] = await queryBuilder.getManyAndCount();
      return { messages, total };
    } catch (error) {
      console.error('Error on getAllMembersOfGroup', error);
      throw new WsException(error);
    }
  }

  /**
   * Find room
   * @param data
   * @returns
   */
  async findRoom(data: any) {
    try {
      const room = await this.chatRoomRepository.findOne({
        where: data,
      });
      return room;
    } catch (error) {
      console.error('Error on findRoom', error);
      throw new WsException(error);
    }
  }

  /**
   * find group members
   * @param data
   * @returns
   */
  async findGroupMember(data: Partial<GroupMembers>) {
    try {
      const groupMember = await this.groupMembersRepository.findOne({
        where: data,
      });
      return groupMember;
    } catch (error) {
      console.error('Error on findGroupMember', error);
      throw new WsException(error);
    }
  }

  /**
   * Upgrade group message receivers
   * @param data
   * @returns
   */
  async updateGroupMessageReceivers(
    updateBy: Partial<GroupMessagesReceivers>,
    updateData: Partial<GroupMessagesReceivers>,
  ) {
    try {
      const updateMessages = await this.groupMessageReceiverRepository.update(
        updateBy,
        updateData,
      );
      return updateMessages;
    } catch (error) {
      console.error('Error on updateGroupMessageReceivers', error);
      throw new WsException(error);
    }
  }

  /**
   * Find chat room of one to one
   * @param chatRoomIds
   * @returns
   */
  async queryToFindRoomsByIds(chatRoomIds: number[], message_id: number) {
    try {
      const findChatRoomsQuery = this.chatRoomRepository
        .createQueryBuilder('chat_rooms')
        .where('(chat_rooms.school_id IS NULL)')
        .andWhere('chat_rooms.id IN (:...ids)', { ids: chatRoomIds })
        .leftJoinAndMapOne(
          'chat_rooms.chat_messages',
          'chat_messages',
          'chat_messages',
          'chat_messages.chat_room_id = chat_rooms.id',
        )
        .leftJoinAndMapOne(
          'chat_messages.student',
          'Students',
          'students',
          'students.id = chat_messages.student_id',
        )
        .leftJoinAndMapOne(
          'chat_messages.receiver_user',
          'users',
          'receiver_users',
          'receiver_users.id = chat_messages.receiver_id',
        )
        .leftJoinAndMapOne(
          'chat_messages.sender_user',
          'users',
          'sender_users',
          'sender_users.id = chat_messages.sender_id',
        )
        .select([
          'chat_rooms.id',
          'chat_rooms.room',
          'chat_messages.id',
          'chat_messages.message',
          'chat_messages.chat_room_id',
          'chat_messages.message_type',
          'chat_messages.is_approved',
          'chat_messages.is_read',
          'chat_messages.createdAt',
          'chat_messages.updatedAt',
          'chat_messages.createdAt AS latest_message',
          'receiver_users.id',
          'receiver_users.firstname',
          'receiver_users.lastname',
          'receiver_users.profile_img',
          'receiver_users.role',
          'sender_users.id',
          'sender_users.firstname',
          'sender_users.lastname',
          'sender_users.profile_img',
          'sender_users.role',
          'students.firstname',
          'students.lastname',
          'students.id',
          'students.profile_img',
        ])
        .orderBy('latest_message', 'DESC')
        .addGroupBy('chat_rooms.id')
        .addGroupBy('chat_messages.id');
      if (message_id) {
        findChatRoomsQuery.andWhere('chat_messages.id = :message_id', {
          message_id,
        });
      }
      return findChatRoomsQuery;
    } catch (error) {
      console.error('Error on queryToFindRoomsByIds', error);
      throw new WsException(error);
    }
  }

  async getUsersJoinedGroupRoomIds(user_id: number) {
    try {
      const chatRoomsData = await this.groupMembersRepository
        .createQueryBuilder('group_members')
        .where('(group_members.user_id = :user_id)', {
          user_id,
        })
        .select(['group_members.id', 'group_members.chat_room_id'])
        .getMany();
      return chatRoomsData;
    } catch (error) {
      console.error('Error on queryToFindLastGroupMessageByRoom', error);
      throw new WsException(error);
    }
  }
  /**
   * Get chat group room with last mesage
   * @param room_ids
   * @returns
   */
  async queryToGetGroupsByIds(room_ids: number[], message_id: number) {
    try {
      const userGroups = this.chatRoomRepository
        .createQueryBuilder('chat_room')
        .where('(chat_room.school_id IS NOT NULL)')
        .andWhere('chat_room.id IN (:...ids)', { ids: room_ids })
        .leftJoinAndSelect('chat_room.school', 'school')
        .leftJoinAndMapOne(
          'chat_room.group_messages',
          'group_message',
          'group_message',
          'group_message.chat_room_id = chat_room.id',
        )
        .leftJoinAndSelect('group_message.user', 'sender_user')
        .select([
          'chat_room.id',
          'chat_room.room',
          'chat_room.school_id',
          'school.id',
          'school.name',
          'sender_user.id',
          'sender_user.firstname',
          'sender_user.lastname',
          'sender_user.profile_img',
          'sender_user.role',
          'group_message.id',
          'group_message.sender_id',
          'group_message.message',
          'group_message.message_type',
          'group_message.createdAt',
          'group_message.deletedAt',
          'group_message.chat_room_id',
          'group_message.updatedAt',
        ])
        .orderBy('group_message.createdAt', 'DESC');
      if (message_id) {
        userGroups.andWhere('group_message.id = :id', { id: message_id });
      }
      userGroups.andWhere('school.status = 1');
      return userGroups;
    } catch (error) {
      console.error('Error on queryToGetGroupsByIds', error);
      throw new WsException(error);
    }
  }

  /**
   * update group message
   * @param sender_id
   * @param message_id
   * @param message
   * @returns
   */
  async updateGroupMessage(
    sender_id: number,
    message_id: number,
    message: string,
  ) {
    try {
      await this.updateGroupMessageByData(
        { id: message_id, sender_id },
        { message: message, sender_id },
      );
      const findMessage = await this.findGroupMessage({
        id: message_id,
        sender_id,
      });
      if (!findMessage) {
        throw new WsException('Group message not found');
      }
      return findMessage;
    } catch (error) {
      console.error('Error on updateGroupMessage', error);
      throw new WsException(error);
    }
  }

  /**
   * Update group message
   * @param whereOption
   * @param updateData
   * @returns
   */
  async updateGroupMessageByData(
    whereOption: Partial<GroupMessages>,
    updateData: Partial<GroupMessages>,
  ) {
    try {
      const message = await this.groupMessageRepository.update(
        whereOption,
        updateData,
      );
      return message;
    } catch (error) {
      console.error('Error on updateGroupMessageByData', error);
      throw new WsException(error);
    }
  }

  /**
   * Find group message
   * @param whereOption
   * @param updateData
   * @returns
   */
  async findGroupMessage(findData: Partial<GroupMessages>) {
    try {
      const message = await this.groupMessageRepository.findOne({
        where: findData,
        relations: {
          chat_room: true,
        },
      });
      return message;
    } catch (error) {
      console.error('Error on updateGroupMessageByData', error);
      throw new WsException(error);
    }
  }

  /**
   * broadcast message from parent to teacher
   * @param broadcastMessageData
   * @param sender_id
   */
  async makeBroadCastMessage(
    broadcastMessageData: BroadcastMessageDto,
    sender_user: Partial<Users>,
    server: Server,
  ) {
    try {
      let message_type: any = 'text';
      let userMessage = broadcastMessageData.message;
      const isBaseData = this.helperService.isBase64(userMessage);
      if (isBaseData) {
        message_type = isBaseData.type;
        const { Location } = await this.awsService.uploadToAWS(
          `chat_${message_type}`,
          userMessage,
          'message',
        );
        userMessage = Location;
      }
      await Promise.all(
        broadcastMessageData.user_data.map(async (userData) => {
          const receiverUser = await this.findUser({
            id: userData.user_id,
            chat_feature: CHAT_FEATURE.ENABLE,
          });
          const student = await this.findStudent(
            userData.student_id,
            sender_user.id,
            userData.user_id,
          );
          const roomData = await this.getRoom(
            sender_user.id,
            userData.user_id,
            userData.student_id,
          );
          let room_id = roomData?.chat_room_id;
          let room_name = roomData?.chat_rooms?.room;
          if (!room_id) {
            const { id, room } = await this.findOrCreateRoom(
              sender_user.id,
              userData.user_id,
              userData.student_id,
            );
            room_id = id;
            room_name = room;
          }
          const message: CreateMessageDto = {
            message_type,
            message: userMessage,
            receiver_id: userData.user_id,
            sender_id: sender_user.id,
            student_id: userData.student_id,
            chat_room_id: room_id,
          };
          const createMessage = await this.createMessage(message);
          const sendMessageToClient = await this.createReturnMessage(
            room_id,
            room_name,
            student,
            sender_user,
            receiverUser,
            createMessage,
          );

          let allSockets = [];
          const receiverUserSockets = this.sessions.getUserSession(
            userData.user_id,
          );
          const senderUserSockets = this.sessions.getUserSession(
            sender_user.id,
          );
          if (receiverUserSockets) {
            allSockets = [...allSockets, ...receiverUserSockets];
          }
          if (senderUserSockets) {
            allSockets = [...allSockets, ...senderUserSockets];
          }
          server.to(allSockets).emit('on-message', {
            temp_time: broadcastMessageData?.temp_time,
            message: sendMessageToClient,
          });
        }),
      );
    } catch (error) {
      console.error('Error on makeBroadCastMessage', error);
      throw new WsException(error);
    }
  }

  /**
   * Delete message of one to one chat
   * @param message_id
   * @param room_id
   */
  async deleteMessageOfOneToOneChat(
    message_id: number,
    room_id: number,
    user: Partial<Users>,
  ) {
    try {
      const findMessage = await this.findChatMessage({
        id: message_id,
        sender_id: user.id,
        chat_room_id: room_id,
      });
      if (!findMessage) {
        throw new WsException('Message not found');
      }
      const receiverUser = await this.findUser(findMessage.id);
      if (findMessage.message_type !== 'text') {
        await this.awsService.removeFromBucket(findMessage.message);
      }
      await this.chatMessageRepository.softDelete({
        id: message_id,
        chat_room_id: room_id,
      });
      const lastMessageOfRoom = await this.chatMessageRepository.findOne({
        where: {
          chat_room_id: room_id,
        },
        order: { createdAt: 'DESC' },
        relations: {
          student: true,
        },
      });
      const returnMessage = await this.createReturnMessage(
        room_id,
        findMessage.chat_rooms.room,
        lastMessageOfRoom.student,
        user,
        receiverUser,
        lastMessageOfRoom,
      );
      return { returnMessage, findMessage };
    } catch (error) {
      console.error('Error on deleteMessageOfOneToOneChat', error);
      throw new WsException(error);
    }
  }

  /**
   * Get room info
   * @param userId
   * @param receiver_id
   * @param student_id
   * @returns
   */
  async getRoomInfo(userId: number, receiver_id: number, student_id: number) {
    try {
      const sender_user = await this.findUser({
        id: userId,
        chat_feature: CHAT_FEATURE.ENABLE,
        status: STATUS.ACTIVE,
      });
      const receiver_user = await this.findUser({
        id: receiver_id,
        chat_feature: CHAT_FEATURE.ENABLE,
        status: STATUS.ACTIVE,
      });
      if (
        !sender_user ||
        !receiver_user ||
        sender_user.role === receiver_user.role
      ) {
        throw new WsException('Invalid chat selection!');
      }
      const student = await this.findStudent(student_id, userId, receiver_id);
      const isRoomExist = await this.getRoom(userId, receiver_id, student_id);
      if (!isRoomExist) {
        const findOrCreateRoom = await this.findOrCreateRoom(
          userId,
          receiver_id,
          student_id,
        );
        const returnMessage = await this.createReturnMessage(
          findOrCreateRoom.id,
          findOrCreateRoom.room,
          student,
          sender_user,
          receiver_user,
          null,
        );
        return returnMessage;
      }
      const roomData = await (
        await this.queryToFindRoomsByIds([isRoomExist.chat_rooms.id], undefined)
      ).getOne();
      return roomData;
    } catch (error) {
      console.error('Error on getRoomInfo', error);
      throw new WsException(error);
    }
  }

  async createReturnMessage(
    room_id: number,
    room_name: string,
    student: Students,
    sender_user: Partial<Users>,
    receiver_user: Users,
    message: ChatMessages | null,
  ) {
    return {
      id: room_id,
      room: room_name,
      chat_messages: {
        id: message ? message.id : null,
        createdAt: message ? message.createdAt : null,
        updatedAt: message ? message.updatedAt : null,
        message: message ? message.message : null,
        message_type: message ? message.message_type : null,
        is_read: message ? message.is_read : null,
        is_approved: message ? message.is_approved : null,
        chat_room_id: room_id,
        student: {
          id: student.id,
          firstname: student.firstname,
          lastname: student.lastname,
          profile_img: student.profile_img,
        },
        receiver_user: {
          id: receiver_user.id,
          firstname: receiver_user.firstname,
          lastname: receiver_user.lastname,
          role: receiver_user.role,
          profile_img: receiver_user.profile_img,
        },
        sender_user: {
          id: sender_user.id,
          firstname: sender_user.firstname,
          lastname: sender_user.lastname,
          role: sender_user.role,
          profile_img: sender_user.profile_img,
        },
      },
    };
  }
}
