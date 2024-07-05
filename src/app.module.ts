import { HttpStatus, Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './admin/auth/auth.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { ProductModule } from './admin/products/products.module';
import { HelperService } from './helper.service';
import { AwsModule } from './aws/aws.module';
import { BlogsAndNewsModule } from './admin/blogs_news/blogsAndNews.module';
import { SchoolsModule } from './admin/schools/schools.module';
import { FrontEndAuthModule } from './frontend/auth/auth.module';
import { FrontEndProductsModule } from './frontend/products/products.module';
import { ChatModule } from './chat/chat.module';
import { DashboardModule } from './admin/dashboard/dashboard.module';
import { FrontEndParentsModule } from './frontend/parents/parents.module';
import { RedisService } from './redis/redis.service';
import { FrontEndTeachersModule } from './frontend/teachers/teachers.module';
import { TeachersModule } from './admin/teachers/teachers.module';
import { NotificationModule } from './notification/notification.module';
import { ParentsStudentsModule } from './admin/parents_students/parents_students.module';
import { APP_PIPE } from '@nestjs/core';
import { RolesPermissionsModule } from './admin/roles_permissions/roles_permissions.module';
import { AdminSubscriptionPlanModule } from './admin/subscription_plan/subscriptionPlan.module';
import { FrontEndSubscriptionPlanModule } from './frontend/subscription_plan/subscriptionPlan.module';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { FrontEndBlogsAndNewsModule } from './frontend/blogs_and_news/blogs_and_news.module';
import { ClassModule } from './admin/class/class.module';
import { VideoStreamingModule } from './admin/video_streaming/videoStreaming.module';
import { SubjectModule } from './admin/subjects/subject.module';
import { LogEventsModule } from './admin/log_events/log_events.module';
import { PushNotificationModule } from './push_notifications/push_notifications.module';
import { AnnouncementModule } from './admin/announcement/announcement.module';
import { CronModule } from './cron/cron.module';
import { FrontEndVideoStreamingModule } from './frontend/video_streaming/videoStreaming.module';
import { FrontendParentTeacherCommonModule } from './frontend/parent_teacher_common/parent_teacher_common.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      stringifyResult: (value: any) => {
        // If Success
        if (value.errors === undefined) {
          let newMessage: string | undefined;
          for (const key in value.data) {
            if (value.data[key]?.message) {
              newMessage = value.data[key].message;
              break;
            }
          }
          return {
            success: true,
            statusCode: HttpStatus.OK,
            message: newMessage,
            data: value.data,
          };
        }
        const statusCode =
          value?.errors[0]?.extensions?.originalError?.statusCode;
        let errorMessage = value.errors[0]?.message;
        if (errorMessage && errorMessage === 'Bad Request Exception') {
          errorMessage = value.errors[0].extensions.originalError.message[0];
        }
        value.errors[0].message = errorMessage;
        const errors = value.errors;
        const errorObject: any = {
          success: false,
          message: errorMessage ? errorMessage : 'Bad request!',
          statusCode: statusCode
            ? statusCode
            : value?.errors[0]?.extensions?.statusCode
              ? value?.errors[0]?.extensions?.statusCode
              : HttpStatus.BAD_REQUEST,
          errors: errors,
        };
        return errorObject;
      },
    }),
    AuthModule,
    EmailModule,
    RedisModule,
    ProductModule,
    BlogsAndNewsModule,
    AwsModule,
    SchoolsModule,
    FrontEndAuthModule,
    FrontEndProductsModule,
    ChatModule,
    DashboardModule,
    FrontEndTeachersModule,
    TeachersModule,
    FrontEndParentsModule,
    NotificationModule,
    ParentsStudentsModule,
    RolesPermissionsModule,
    AdminSubscriptionPlanModule,
    FrontEndSubscriptionPlanModule,
    StripeModule,
    WebhookModule,
    FrontEndBlogsAndNewsModule,
    ClassModule,
    VideoStreamingModule,
    SubjectModule,
    LogEventsModule,
    PushNotificationModule,
    AnnouncementModule,
    CronModule,
    FrontEndVideoStreamingModule,
    FrontendParentTeacherCommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HelperService,
    RedisService,
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
  exports: [HelperService],
})
export class AppModule {}
