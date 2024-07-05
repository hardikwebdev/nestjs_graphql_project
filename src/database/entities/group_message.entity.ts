import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';
import { ChatRooms } from './chat_room.entity';
import { GroupMessagesReceivers } from './group_message_receiver.entity';
import { MessageType } from 'src/constants';

@ObjectType()
@Entity({ name: 'group_message' })
export class GroupMessages extends BaseEntity {
  @Field(() => ID!)
  @Column()
  sender_id: number;

  @Field(() => ID!)
  @Column()
  chat_room_id: number;

  @Field()
  @Column({ type: 'longtext' })
  message: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  message_type: MessageType;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.group_message)
  @JoinColumn({ name: 'sender_id' })
  user: Users;

  @Field(() => ChatRooms)
  @ManyToOne(() => ChatRooms, (chatRooms) => chatRooms.group_messages)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRooms;

  @Field(() => [GroupMessagesReceivers])
  @OneToMany(
    () => GroupMessagesReceivers,
    (groupMessagesReceivers) => groupMessagesReceivers.group_messages,
  )
  group_message_receiver: GroupMessagesReceivers[];
}
