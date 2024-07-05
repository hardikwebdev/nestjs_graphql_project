import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { ChatMessages } from './chat_messages.entity';
import { Schools } from './schools.entity';
import { GroupMembers } from './group_members.entity';
import { GroupMessages } from './group_message.entity';
import { GroupMessagesReceivers } from './group_message_receiver.entity';

@ObjectType()
@Entity({ name: 'chat_rooms' })
export class ChatRooms extends BaseEntity {
  @Field()
  @Column()
  room: string;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true, unique: true })
  school_id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'longtext' })
  room_users: string;

  @Field(() => [ChatMessages])
  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.chat_rooms)
  chat_messages: ChatMessages[];

  @Field(() => Schools)
  @OneToOne(() => Schools, (schools) => schools.chat_room)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @Field(() => [GroupMembers])
  @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.chat_room)
  group_members: GroupMembers[];

  @Field(() => [GroupMessages])
  @OneToMany(() => GroupMessages, (groupMessages) => groupMessages.chat_room)
  group_messages: GroupMessages[];

  @Field(() => [GroupMessagesReceivers])
  @OneToMany(
    () => GroupMessagesReceivers,
    (groupMessagesReceivers) => groupMessagesReceivers.chat_room,
  )
  group_message_receivers: GroupMessagesReceivers[];
}
