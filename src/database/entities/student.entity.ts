import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { STATUS, YES_NO_OR_CURRENTLY } from 'src/constants';
import { Users } from './user.entity';
import { ChatMessages } from './chat_messages.entity';
import { PaperWorks } from './paperworks.entity';
import { StudentClassMappings } from './student_class_mappings.entity';
import { Schools } from './schools.entity';
import { ClockInOutLogs } from './clock_in_out.entity';
import { Event_RSVP } from './event_rsvp.entity';
import { LogEvents } from './log_events.entity';
import { UserRecentLogs } from './user_recent_logs.entity';
import { UserAttendence } from './user_attendance.entity';
import { ZoomCallMeetings } from './zoom_call_meetings.entity';

@ObjectType()
@Entity({ name: 'Students' })
export class Students extends BaseEntity {
  @Field()
  @Column({ length: 45 })
  firstname: string;

  @Field()
  @Column({ length: 45 })
  lastname: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profile_img: string;

  @Field(() => String)
  @Column({ type: 'date' })
  birthdate: Date;

  @Field({ nullable: true })
  @Column({ type: 'tinyint', nullable: true })
  child_care_before: number;

  @Field({ nullable: true })
  @Column({ type: 'tinyint', nullable: true })
  transition_days: number;

  @Field({ nullable: true })
  @Column({ type: 'tinyint', nullable: true })
  potty_trained: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  payment_type: string;

  @Field({ nullable: true })
  @Column({ type: 'tinyint', nullable: true })
  lunch_program: number;

  @Field()
  @Column()
  home_address: string;

  @Field()
  @Column({ type: 'tinyint', default: STATUS.ACTIVE })
  status: number;

  @Field()
  @Column()
  emergency_contact: string;

  @Field()
  @Column()
  parent_id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  school_id: number;

  @Field()
  @Column({ type: 'tinyint', default: YES_NO_OR_CURRENTLY.NO })
  is_allergy: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  allergy_description: string;

  @Field()
  @Column({ type: 'text' })
  parent_details: string;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.students)
  @JoinColumn({ name: 'parent_id' })
  parent: Users;

  @Field(() => [ChatMessages])
  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.student)
  chat_messges: ChatMessages;

  @Field(() => [PaperWorks])
  @OneToMany(() => PaperWorks, (paperWorks) => paperWorks.student)
  paperworks: PaperWorks[];

  @Field(() => [StudentClassMappings])
  @OneToMany(
    () => StudentClassMappings,
    (studentClassMappings) => studentClassMappings.student,
  )
  student_class_mappings: StudentClassMappings[];

  @Field(() => Schools, { nullable: true })
  @ManyToOne(() => Schools, (school) => school.students)
  @JoinColumn({ name: 'school_id' })
  school: Schools;

  @Field(() => [ClockInOutLogs])
  @OneToMany(() => ClockInOutLogs, (clockInOutLogs) => clockInOutLogs.student)
  clock_in_out_logs: ClockInOutLogs[];

  @Field(() => [Event_RSVP])
  @OneToMany(() => Event_RSVP, (event_rsvp) => event_rsvp.student)
  event_rsvp: Event_RSVP[];

  @Field(() => [LogEvents])
  @OneToMany(() => LogEvents, (logEvents) => logEvents.student)
  log_events: LogEvents[];

  @Field(() => [UserRecentLogs])
  @OneToMany(() => UserRecentLogs, (userRecentLogs) => userRecentLogs.student)
  user_recent_logs: UserRecentLogs[];

  @Field(() => [UserAttendence])
  @OneToMany(() => UserAttendence, (userAttendence) => userAttendence.student)
  user_attendance: UserAttendence[];

  @Field(() => [ZoomCallMeetings], { nullable: true })
  @OneToMany(
    () => ZoomCallMeetings,
    (zoomCallMeetings) => zoomCallMeetings.student,
  )
  zoom_call_meetings: ZoomCallMeetings[];
}
