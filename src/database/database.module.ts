import { Module } from '@nestjs/common';
import { dataSource } from './database.providers';
import { DataSource } from 'typeorm';
import { Users } from './entities/user.entity';
import { Products } from './entities/product.entity';
import { Schools } from './entities/schools.entity';
import { Orders } from './entities/orders.entity';
import { UserSchoolMappings } from './entities/user_school_mapping.entity';
import { OrderDetails } from './entities/order_details.entity';
import { BlogsAndNews } from './entities/blogs_news.entity';
import { CMSPage } from './entities/cms.entity';
import { Students } from './entities/student.entity';
import { ChatRooms } from './entities/chat_room.entity';
import { ChatMessages } from './entities/chat_messages.entity';
import { UserDevice } from './entities/user_devices.entity';
import { UserRoles } from './entities/user_roles.entity';
import { PaperWorks } from './entities/paperworks.entity';
import { Classes } from './entities/classes.entity';
import { TeacherClassMappings } from './entities/teacher_class_mappings.entity';
import { StudentClassMappings } from './entities/student_class_mappings.entity';
import { ZoomCallTiming } from './entities/zoom_call_timing.entity';
import { SickRequests } from './entities/sick_requests.entity';
import { ReimbursementRequests } from './entities/reimbursement_receipt.entity';
import { UserCartDetails } from './entities/cart.entity';
import { ClockInOutLogs } from './entities/clock_in_out.entity';
import { Category } from './entities/category.entity';
import { GroupMessages } from './entities/group_message.entity';
import { GroupMembers } from './entities/group_members.entity';
import { GroupMessagesReceivers } from './entities/group_message_receiver.entity';
import { SubscriptionPlan } from './entities/subscription_plan.entity';
import { SubscribedUser } from './entities/subscribed_users.entity';
import { RolesPermissions } from './entities/roles_permissions.entity';
import { Quotes } from './entities/quote.entity';
import { Event } from './entities/events.entity';
import { EventSchoolMappings } from './entities/event_school_mappings.entity';
import { Event_RSVP } from './entities/event_rsvp.entity';
import { UserOnboardingDocuments } from './entities/user_onboarding_documents.entity';
import { LogEvents } from './entities/log_events.entity';
import { VideoStreaming } from './entities/video_streaming.entity';
import { SuppliesList } from './entities/supplies_list.entity';
import { Subjects } from './entities/subject.entity';
import { LessonPlans } from './entities/lesson_plans.entity';
import { SubjectClassMappings } from './entities/subject_class_mapping.entity';
import { LessonPlanAttachments } from './entities/lesson_plan_attachments.entity';
import { LogEventType } from './entities/log_event_type.entity';
import { UserRecentLogs } from './entities/user_recent_logs.entity';
import { BulletinBoard } from './entities/bulletin_board.entity';
import { BulletinUserClassMappings } from './entities/bulletin_user_class_mapping.entity';
import { UserAttendence } from './entities/user_attendance.entity';
import { Newsletter } from './entities/newsletter.entity';
import { NewsletterClassMappings } from './entities/newsletter_class_mappings.entity';
import { OnboardingDocumentsList } from './entities/onboarding_documents_list.entity';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementUserMappings } from './entities/announcement_user_mapping.entity';
import { PushNotifications } from './entities/push_notifications.entity';
import { ZoomCallMeetings } from './entities/zoom_call_meetings.entity';
import { UserVideoBookmarks } from './entities/user_video_bookmark.entity';
import { ExchangeReturnRequest } from './entities/exchange_return_request.entity';

@Module({
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
        return dataSource.initialize();
      },
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Products),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SCHOOL_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Schools),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ORDER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Orders),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ORDER_DETAILS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(OrderDetails),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_SCHOOL_MAPPING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserSchoolMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BLOG_NEWS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(BlogsAndNews),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CMS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(CMSPage),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'STUDENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Students),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CHAT_ROOM_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ChatRooms),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CHAT_MESSAGE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ChatMessages),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_DEVICE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserDevice),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_ROLES_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserRoles),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PAPERWORKS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(PaperWorks),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CLASSES_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Classes),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'TEACHER_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(TeacherClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'STUDENT_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(StudentClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SICK_REQUESTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SickRequests),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'REIMBURSEMENT_REQUESTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ReimbursementRequests),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ZOOM_CALL_TIMING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ZoomCallTiming),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_CART_DETAILS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserCartDetails),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CLOCK_IN_OUT_LOGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ClockInOutLogs),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CATEGORY_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Category),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'GROUP_MEMBERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(GroupMembers),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'GROUP_MESSAGE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(GroupMessages),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'GROUP_MESSAGE_RECEIVERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(GroupMessagesReceivers),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBSCRIPTION_PLAN_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SubscriptionPlan),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBSCRIBED_USERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SubscribedUser),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ROLES_PERMISSIONS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(RolesPermissions),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'QUOTES_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Quotes),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EVENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Event),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EVENT_SCHOOL_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(EventSchoolMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EVENT_RSVP_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Event_RSVP),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_ONBOARDING_DOCUMENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserOnboardingDocuments),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LOG_EVENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LogEvents),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'VIDEO_STREAMING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(VideoStreaming),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUPPLIES_LIST_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SuppliesList),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBJECTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Subjects),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LESSON_PLANS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LessonPlans),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBJECT_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SubjectClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LESSON_PLAN_ATTACHMENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LessonPlanAttachments),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LOG_EVENT_TYPE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LogEventType),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_RECENT_LOGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserRecentLogs),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BULLETIN_BOARD_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(BulletinBoard),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BULLETIN_USER_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(BulletinUserClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_ATTENDANCE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserAttendence),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'NEWSLETTER_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Newsletter),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'NEWSLETTER_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(NewsletterClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ONBOARDING_DOCUMENTS_LIST_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(OnboardingDocumentsList),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ANNOUNCEMENT_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Announcement),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ANNOUNCEMENT_USER_MAPPING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(AnnouncementUserMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PUSH_NOTIFICATIONS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(PushNotifications),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ZOOM_CALL_MEETINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ZoomCallMeetings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_VIDEO_BOOKMARKS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserVideoBookmarks),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EXCHANGE_RETURN_REQUESTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ExchangeReturnRequest),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [
    {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
        return dataSource.initialize();
      },
    },
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Products),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SCHOOL_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Schools),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ORDER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Orders),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_SCHOOL_MAPPING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserSchoolMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ORDER_DETAILS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(OrderDetails),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BLOG_NEWS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(BlogsAndNews),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CMS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(CMSPage),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'STUDENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Students),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CHAT_ROOM_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ChatRooms),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CHAT_MESSAGE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ChatMessages),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_DEVICE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserDevice),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_ROLES_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserRoles),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PAPERWORKS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(PaperWorks),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CLASSES_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Classes),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'TEACHER_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(TeacherClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'STUDENT_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(StudentClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ZOOM_CALL_TIMING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ZoomCallTiming),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SICK_REQUESTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SickRequests),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'REIMBURSEMENT_REQUESTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ReimbursementRequests),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_CART_DETAILS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserCartDetails),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CLOCK_IN_OUT_LOGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ClockInOutLogs),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'CATEGORY_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Category),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'GROUP_MEMBERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(GroupMembers),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'GROUP_MESSAGE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(GroupMessages),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'GROUP_MESSAGE_RECEIVERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(GroupMessagesReceivers),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBSCRIPTION_PLAN_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SubscriptionPlan),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBSCRIBED_USERS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SubscribedUser),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ROLES_PERMISSIONS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(RolesPermissions),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'QUOTES_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Quotes),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EVENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Event),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EVENT_SCHOOL_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(EventSchoolMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EVENT_RSVP_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Event_RSVP),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_ONBOARDING_DOCUMENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserOnboardingDocuments),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LOG_EVENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LogEvents),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'VIDEO_STREAMING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(VideoStreaming),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUPPLIES_LIST_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SuppliesList),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBJECTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Subjects),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LESSON_PLANS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LessonPlans),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'SUBJECT_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(SubjectClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LESSON_PLAN_ATTACHMENTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LessonPlanAttachments),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'LOG_EVENT_TYPE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(LogEventType),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_RECENT_LOGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserRecentLogs),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BULLETIN_BOARD_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(BulletinBoard),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'BULLETIN_USER_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(BulletinUserClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_ATTENDANCE_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserAttendence),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'NEWSLETTER_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Newsletter),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'NEWSLETTER_CLASS_MAPPINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(NewsletterClassMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ONBOARDING_DOCUMENTS_LIST_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(OnboardingDocumentsList),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ANNOUNCEMENT_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(Announcement),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ANNOUNCEMENT_USER_MAPPING_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(AnnouncementUserMappings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'PUSH_NOTIFICATIONS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(PushNotifications),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'ZOOM_CALL_MEETINGS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ZoomCallMeetings),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'USER_VIDEO_BOOKMARKS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserVideoBookmarks),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'EXCHANGE_RETURN_REQUESTS_REPOSITORY',
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(ExchangeReturnRequest),
      inject: ['DATA_SOURCE'],
    },
  ],
})
export class DatabaseModule {}
