import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { IS_READ, IS_SENT, MEETING_STATUS, MessageType } from 'src/constants';
import { Users } from './user.entity';
import { ChatRooms } from './chat_room.entity';
import { Students } from './student.entity';
import { ZoomCallMeetings } from './zoom_call_meetings.entity';

@ObjectType()
@Entity({ name: 'chat_messages' })
export class ChatMessages extends BaseEntity {
  @Field()
  @Column({ type: 'longtext' })
  message: string;

  @Field(() => String)
  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  message_type: MessageType;

  @Field(() => ID)
  @Column()
  sender_id: number;

  @Field(() => ID)
  @Column()
  receiver_id: number;

  @Field(() => ID)
  @Column()
  student_id: number;

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

  @Field()
  @Column({
    type: 'tinyint',
    default: IS_SENT.FALSE,
    comment: '1: sent, 0: unsent',
  })
  is_sent: number;

  @Field(() => Int)
  @Column({
    type: 'tinyint',
    default: MEETING_STATUS.PENDING,
    comment: '0: pending, 1: approved, 2: rejected',
  })
  is_approved: number;

  @Field(() => [Users])
  @ManyToOne(() => Users, (users) => users.sent_messages)
  @JoinColumn({ name: 'sender_id' })
  sender_user: Users;

  @Field(() => [Users])
  @ManyToOne(() => Users, (users) => users.receive_messages)
  @JoinColumn({ name: 'receiver_id' })
  receiver_user: Users;

  @Field(() => ChatRooms)
  @ManyToOne(() => ChatRooms, (chatRooms) => chatRooms.chat_messages)
  @JoinColumn({ name: 'chat_room_id' })
  chat_rooms: ChatRooms;

  @Field(() => Students)
  @ManyToOne(() => Students, (students) => students.chat_messges)
  @JoinColumn({ name: 'student_id' })
  student: Students;

  @Field(() => [ZoomCallMeetings], { nullable: true })
  @OneToMany(
    () => ZoomCallMeetings,
    (zoomCallMeetings) => zoomCallMeetings.chat_message,
  )
  zoom_call_meetings: ZoomCallMeetings[];
}
