import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtTeacherParentAuthGuard } from 'src/guards/parent_teacher_guard/parent_teacher_jwt.guard';
import { PushNotificationService } from './push_notifications.service';
import { ListPushNotificationObjectType } from './dto/listPushNotification.object';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@Resolver()
export class PushNotificationResolver {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  /**
   * Get push notifications of user
   * @param userId
   * @returns
   */
  @Query(() => ListPushNotificationObjectType)
  @UseGuards(JwtTeacherParentAuthGuard)
  async getPushNotificationsOfParentTeacher(
    @Context() context: any,
    @Args('pageNo', { type: () => Int, nullable: true }) pageNo: number,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize: number,
  ) {
    const userId = context.req.user.id;
    return await this.pushNotificationService.getPushNotificationsOfUser(
      userId,
      pageNo,
      pageSize,
    );
  }

  /**
   * Get push notifications of user
   * @param userId
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtTeacherParentAuthGuard)
  async readPushNotificationsOfParentTeacher(
    @Context() context: any,
    @Args('notificationIds', { type: () => [Int!]!, nullable: false })
    notificationIds: number[],
  ) {
    const userId = context.req.user.id;
    return await this.pushNotificationService.readPushNotificationsOfUser(
      userId,
      notificationIds,
    );
  }

  /**
   * Get push notifications count
   * @param userId
   * @returns
   */
  @Query(() => Int, { nullable: true })
  @UseGuards(JwtTeacherParentAuthGuard)
  async getUnreadPushNotificationCount(@Context() context: any) {
    const userId = context.req.user.id;
    return await this.pushNotificationService.getUnreadPushNotificationCount(
      userId,
    );
  }
}
