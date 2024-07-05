import { Inject, Injectable } from '@nestjs/common';
import { IS_READ } from 'src/constants';
import { PushNotifications } from 'src/database/entities/push_notifications.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PushNotificationService {
  constructor(
    @Inject('PUSH_NOTIFICATIONS_REPOSITORY')
    private readonly pushNotificationsRepository: Repository<PushNotifications>,
  ) {}

  /**
   * Get push notification of user with pagination
   * @param userId
   * @param pageNo
   * @param pageSize
   * @returns
   */
  async getPushNotificationsOfUser(userId: number, pageNo = 1, pageSize = 25) {
    const skip = (pageNo - 1) * pageSize;

    const [pushNotifications, total] =
      await this.pushNotificationsRepository.findAndCount({
        where: {
          to_user_id: userId,
        },
        withDeleted: false,
        relations: {
          to_user: true,
          from_user: true,
        },
        skip,
        take: pageSize,
        order: {
          createdAt: 'DESC',
        },
      });
    return { pushNotifications, total };
  }

  /**
   * Read push notification of user
   * @param userId
   * @param notificationIds
   * @returns
   */
  async readPushNotificationsOfUser(userId: number, notificationIds: number[]) {
    await this.pushNotificationsRepository.update(
      {
        id: In(notificationIds),
        to_user_id: userId,
      },
      { is_read: IS_READ.TRUE },
    );
    return { message: 'Notification read successfully!' };
  }

  /**
   * Read push notification of user
   * @param userId
   * @returns
   */
  async getUnreadPushNotificationCount(userId: number) {
    const count = await this.pushNotificationsRepository.count({
      where: {
        is_read: IS_READ.FALSE,
        to_user_id: userId,
      },
    });
    return count;
  }
}
