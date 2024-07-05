import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';
import { IS_READ } from 'src/constants';
import { GroupMessages } from './group_message.entity';
import { ChatRooms } from './chat_room.entity';

@ObjectType()
@Entity({ name: 'group_message_receivers' })
export class GroupMessagesReceivers extends BaseEntity {
  @Field(() => ID!)
  @Column()
  receiver_id: number;

  @Field(() => ID!)
  @Column()
  group_message_id: number;

  @Field(() => ID)
  @Column()
  chat_room_id: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: IS_READ.FALSE,
    comment: '1: read, 0: unread',
  })
  is_read: number;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.group_message_receiver)
  @JoinColumn({ name: 'receiver_id' })
  user: Users;

  @Field(() => GroupMessages)
  @ManyToOne(
    () => GroupMessages,
    (groupMessages) => groupMessages.group_message_receiver,
  )
  @JoinColumn({ name: 'group_message_id' })
  group_messages: GroupMessages;

  @Field(() => ChatRooms)
  @ManyToOne(() => ChatRooms, (chatRooms) => chatRooms.group_message_receivers)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRooms;
}
