import { Field, ObjectType } from '@nestjs/graphql';
import {
  IS_USER_VERIFIED,
  USER_ROLES,
  STATUS,
  IS_MFA,
  CHAT_FEATURE,
} from 'src/constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Orders } from './orders.entity';
import { UserSchoolMappings } from './user_school_mapping.entity';
import { ChatMessages } from './chat_messages.entity';
import { Students } from './student.entity';
import { UserDevice } from './user_devices.entity';
import { PaperWorks } from './paperworks.entity';
import { Classes } from './classes.entity';
import { TeacherClassMappings } from './teacher_class_mappings.entity';
import { ZoomCallTiming } from './zoom_call_timing.entity';
import { SickRequests } from './sick_requests.entity';
import { ReimbursementRequests } from './reimbursement_receipt.entity';
import { UserCartDetails } from './cart.entity';
import { ClockInOutLogs } from './clock_in_out.entity';
import { GroupMembers } from './group_members.entity';
import { GroupMessagesReceivers } from './group_message_receiver.entity';
import { GroupMessages } from './group_message.entity';
import { SubscribedUser } from './subscribed_users.entity';
import { Event_RSVP } from './event_rsvp.entity';
import { UserOnboardingDocuments } from './user_onboarding_documents.entity';
import { LogEvents } from './log_events.entity';
import { LessonPlans } from './lesson_plans.entity';
import { LessonPlanAttachments } from './lesson_plan_attachments.entity';
import { UserRecentLogs } from './user_recent_logs.entity';
import { BulletinUserClassMappings } from './bulletin_user_class_mapping.entity';
import { UserAttendence } from './user_attendance.entity';
import { Newsletter } from './newsletter.entity';
import { AnnouncementUserMappings } from './announcement_user_mapping.entity';
import { PushNotifications } from './push_notifications.entity';
import { ZoomCallMeetings } from './zoom_call_meetings.entity';
import { UserVideoBookmarks } from './user_video_bookmark.entity';
import { Event } from './events.entity';
import { ExchangeReturnRequest } from './exchange_return_request.entity';

@ObjectType()
@Entity()
export class Users {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ length: 45, nullable: true })
  username: string;

  @Field()
  @Column({ length: 45 })
  firstname: string;

  @Field()
  @Column({ length: 45 })
  lastname: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column({ length: 255 })
  password: string;

  @Field({ nullable: true })
  @Column({ length: 45, nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  @Column({
    type: 'tinyint',
    nullable: true,
    default: USER_ROLES.PARENT,
    comment: '0: Super admin, 1: parent, 2 : Teacher, 3: staff',
  })
  role: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active, 2: Block',
  }) // 0: Inactive, 1: Active, 2: Block
  status: number;

  @Field()
  @Column({ default: null, type: 'text' })
  reset_token: string;

  @Field()
  @Column({ length: 255, nullable: true })
  invite_token: string;

  @Field()
  @Column({
    default: IS_USER_VERIFIED.FALSE,
    type: 'tinyint',
  })
  is_verified: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profile_img: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  position: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @Field()
  @Column({ type: 'tinyint', default: IS_MFA.FALSE })
  is_mfa: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: CHAT_FEATURE.ENABLE,
    comment: '0: Disable, 1: Enable',
  })
  chat_feature: number;

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Field()
  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: Date;

  @Field(() => [Orders])
  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];

  @Field(() => [UserSchoolMappings])
  @OneToMany(
    () => UserSchoolMappings,
    (userSchoolMappings) => userSchoolMappings.users,
  )
  userSchoolMappings: UserSchoolMappings[];

  @Field(() => [ChatMessages])
  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.sender_user)
  sent_messages: ChatMessages[];

  @Field(() => [ChatMessages])
  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.receiver_user)
  receive_messages: ChatMessages[];

  @Field(() => [Students])
  @OneToMany(() => Students, (students) => students.parent)
  students: Students[];

  @Field(() => [UserDevice])
  @OneToMany(() => UserDevice, (devices) => devices.user_id)
  devices: UserDevice[];

  @Field(() => [PaperWorks])
  @OneToMany(() => PaperWorks, (paperWorks) => paperWorks.user)
  paperworks: PaperWorks[];

  @Field(() => [SickRequests])
  @OneToMany(() => SickRequests, (sick_requests) => sick_requests.users)
  sick_requests: SickRequests[];

  @Field(() => [Classes])
  @OneToMany(() => Classes, (classes) => classes.user)
  classes: Classes[];

  @Field(() => [TeacherClassMappings])
  @OneToMany(
    () => TeacherClassMappings,
    (teacherClassMappings) => teacherClassMappings.user,
  )
  teacher_class_mapping: TeacherClassMappings[];

  @Field(() => [ZoomCallTiming])
  @OneToMany(() => ZoomCallTiming, (zoomCallTiming) => zoomCallTiming.user)
  zoom_call_timing: ZoomCallTiming[];

  @Field(() => [ReimbursementRequests])
  @OneToMany(
    () => ReimbursementRequests,
    (reimbursement_requests) => reimbursement_requests.users,
  )
  reimbursement_requests: ReimbursementRequests[];

  @Field(() => [UserCartDetails])
  @OneToMany(
    () => UserCartDetails,
    (user_cart_details) => user_cart_details.users,
  )
  user_cart_details: UserCartDetails[];

  @Field(() => [ClockInOutLogs])
  @OneToMany(() => ClockInOutLogs, (clockInOutLogs) => clockInOutLogs.user)
  clock_in_out_logs: ClockInOutLogs[];

  @Field(() => [GroupMembers])
  @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.user)
  group_members: GroupMembers[];

  @Field(() => [GroupMessages])
  @OneToMany(() => GroupMessages, (groupMessages) => groupMessages.user)
  group_message: GroupMessages[];

  @Field(() => [GroupMessagesReceivers])
  @OneToMany(
    () => GroupMessagesReceivers,
    (groupMessagesReceivers) => groupMessagesReceivers.user,
  )
  group_message_receiver: GroupMessagesReceivers[];

  @Field(() => [SubscribedUser])
  @OneToMany(() => SubscribedUser, (subscribedUser) => subscribedUser.user)
  subscribed_user: SubscribedUser[];

  @Field(() => [Event_RSVP])
  @OneToMany(() => Event_RSVP, (event_rsvp) => event_rsvp.user)
  event_rsvp: Event_RSVP[];

  @Field(() => [UserOnboardingDocuments])
  @OneToMany(
    () => UserOnboardingDocuments,
    (UserOnboardingDocuments) => UserOnboardingDocuments.user,
  )
  user_onboarding_documents: UserOnboardingDocuments[];

  @Field(() => [LogEvents])
  @OneToMany(() => LogEvents, (logEvents) => logEvents.user)
  log_events: LogEvents[];

  @Field(() => [LessonPlans])
  @OneToMany(() => LessonPlans, (lessonPlans) => lessonPlans.user)
  lesson_plans: LessonPlans[];

  @Field(() => [LessonPlanAttachments])
  @OneToMany(
    () => LessonPlanAttachments,
    (lessonPlanAttachments) => lessonPlanAttachments.user,
  )
  lesson_plan_attachments: LessonPlanAttachments[];

  @Field(() => [UserRecentLogs])
  @OneToMany(() => UserRecentLogs, (userRecentLogs) => userRecentLogs.user)
  user_recent_logs: UserRecentLogs[];

  @Field(() => [BulletinUserClassMappings])
  @OneToMany(
    () => BulletinUserClassMappings,
    (bulletinUserClassMappings) => bulletinUserClassMappings.users,
  )
  bulletinUserClassMappings: BulletinUserClassMappings[];
  @Field(() => [UserAttendence])
  @OneToMany(() => UserAttendence, (userAttendence) => userAttendence.user)
  user_attendance: UserAttendence[];

  @Field(() => [Newsletter])
  @OneToMany(() => Newsletter, (newsletter) => newsletter.user)
  newsletter: Newsletter[];

  @Field(() => [AnnouncementUserMappings])
  @OneToMany(
    () => AnnouncementUserMappings,
    (announcementUserMappings) => announcementUserMappings.users,
  )
  announcementUserMappings: AnnouncementUserMappings[];

  @Field(() => [PushNotifications], { nullable: true })
  @OneToMany(
    () => PushNotifications,
    (pushNotifications) => pushNotifications.from_user,
  )
  from_push_notifications: PushNotifications[];

  @Field(() => [PushNotifications], { nullable: true })
  @OneToMany(
    () => PushNotifications,
    (pushNotifications) => pushNotifications.to_user,
  )
  to_push_notifications: PushNotifications[];

  @Field(() => [ZoomCallMeetings], { nullable: true })
  @OneToMany(
    () => ZoomCallMeetings,
    (zoomCallMeetings) => zoomCallMeetings.parent,
  )
  parent_zoom_call_meetings: ZoomCallMeetings[];

  @Field(() => [ZoomCallMeetings], { nullable: true })
  @OneToMany(
    () => ZoomCallMeetings,
    (zoomCallMeetings) => zoomCallMeetings.user,
  )
  teacher_zoom_call_meetings: ZoomCallMeetings[];

  @Field(() => [UserVideoBookmarks])
  @OneToMany(
    () => UserVideoBookmarks,
    (userVideoBookmarks) => userVideoBookmarks.videoStreaming,
  )
  user_video_bookmarks: UserVideoBookmarks[];

  @Field(() => [Event], { nullable: true })
  @OneToMany(() => Event, (event) => event.users)
  events: Event[];

  @Field(() => [ExchangeReturnRequest])
  @OneToMany(
    () => ExchangeReturnRequest,
    (exchangeReturnRequests) => exchangeReturnRequests.users,
  )
  exchangeReturnRequests: ExchangeReturnRequest[];
}
