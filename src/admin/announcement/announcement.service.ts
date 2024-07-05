import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Announcement } from 'src/database/entities/announcement.entity';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateAnnouncementInput } from './dto/createAnnouncement.input';
import { AnnouncementUserMappings } from 'src/database/entities/announcement_user_mapping.entity';
import { Users } from 'src/database/entities/user.entity';
import { GraphQLError } from 'graphql';
import {
  IS_PUBLISHED,
  NOTIFICATION_TYPE,
  SORT_ORDER,
  STATUS,
  USER_ROLES,
  UserType,
} from 'src/constants';
import { ListAnnouncementInput } from './dto/listAnnouncement.input';
import { UserDevice } from 'src/database/entities/user_devices.entity';
import * as firebase from 'firebase-admin';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AnnouncementService {
  constructor(
    @Inject('ANNOUNCEMENT_REPOSITORY')
    private readonly announcementRepository: Repository<Announcement>,
    @Inject('ANNOUNCEMENT_USER_MAPPING_REPOSITORY')
    private readonly announcementUserRepository: Repository<AnnouncementUserMappings>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<Users>,
    @Inject('USER_DEVICE_REPOSITORY')
    private readonly userDeviceRepository: Repository<UserDevice>,
    private notificationService: NotificationService,
  ) {}

  /**
   * Update announcement Function
   * @param id
   * @param announcementData
   */
  async updateAnnouncementData(
    id: number,
    announcementData: Partial<Announcement>,
  ) {
    await this.announcementRepository.update({ id }, announcementData);
  }

  /**
   * Create announcement
   * @param createAnnouncementInput
   * @returns
   */
  async createAnnouncement(createAnnouncementData: CreateAnnouncementInput) {
    const { user_Ids, send_to } = createAnnouncementData;

    await this.validateSendTo(send_to);

    if (send_to === UserType.SPECIFIC) {
      if (user_Ids && user_Ids.length === 0) {
        throw new GraphQLError('User selection mandatory!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
    }

    if (user_Ids && user_Ids.length !== 0) {
      await this.validateUserIds(user_Ids);
    }

    const announcement = await this.announcementRepository.insert(
      createAnnouncementData,
    );

    if (user_Ids && user_Ids.length !== 0 && send_to === UserType.SPECIFIC) {
      for await (const userId of user_Ids) {
        await this.announcementUserRepository.insert({
          announcement_id: announcement.generatedMaps[0].id,
          user_id: userId,
        });
      }
    }

    return { message: 'Announcement added successfully!' };
  }

  /**
   * Delete announcement
   * @param announcementId
   * @returns
   */
  async deleteAnnounceMent(announcementId: number) {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
    });

    if (!announcement) {
      throw new GraphQLError(`Announcement not found!`, {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (announcement.is_published === IS_PUBLISHED.TRUE) {
      throw new GraphQLError('Announcement is published!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    await this.announcementRepository.softDelete(announcementId);

    const announcementUserMappings = await this.announcementUserRepository.find(
      { where: { announcement_id: announcementId } },
    );

    if (announcementUserMappings.length !== 0) {
      await this.announcementUserRepository.softDelete({
        announcement_id: announcementId,
      });
    }

    return { message: 'Announcement deleted successfully!' };
  }

  /**
   * Update announcement
   * @param announcementId
   * @param updateAnnouncementInput
   * @returns
   */
  async updateAnnouncement(
    announcementId: number,
    updateAnnouncementData: CreateAnnouncementInput,
  ) {
    const { subject, message, publish_date_time, user_Ids, send_to } =
      updateAnnouncementData;

    await this.validateSendTo(send_to);

    const isAnnouncementExist = await this.announcementRepository.findOne({
      where: { id: announcementId },
    });

    if (!isAnnouncementExist) {
      throw new GraphQLError(`Announcement not found!`, {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (isAnnouncementExist.is_published === IS_PUBLISHED.TRUE) {
      throw new GraphQLError('Announcement is published!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    if (send_to === UserType.SPECIFIC) {
      if (user_Ids && user_Ids.length === 0) {
        throw new GraphQLError('User selection mandatory!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
    }

    if (user_Ids && user_Ids.length !== 0) {
      await this.validateUserIds(user_Ids);
    }

    // create announcement user mapping and remove the same.
    if (send_to === UserType.SPECIFIC) {
      if (user_Ids && user_Ids.length !== 0) {
        for await (const userId of user_Ids) {
          const isUserAnnouncementMappingExist =
            await this.announcementUserRepository.findOne({
              where: { user_id: userId, announcement_id: announcementId },
            });

          if (!isUserAnnouncementMappingExist) {
            await this.announcementUserRepository.insert({
              user_id: userId,
              announcement_id: announcementId,
            });
          }
        }
        await this.announcementUserRepository
          .createQueryBuilder()
          .update(AnnouncementUserMappings)
          .set({ deletedAt: new Date() })
          .where(
            'announcement_id = :announcementId AND user_id NOT IN (:...userIds) AND deletedAt IS NULL',
            {
              announcementId,
              userIds: user_Ids,
            },
          )
          .execute();
      } else {
        throw new GraphQLError('User selection mandatory!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
    }

    // remove announcement user mapping if SPECIFIC to any.
    if (
      send_to !== UserType.SPECIFIC &&
      isAnnouncementExist.send_to === UserType.SPECIFIC
    ) {
      await this.announcementUserRepository
        .createQueryBuilder()
        .update(AnnouncementUserMappings)
        .set({ deletedAt: new Date() })
        .where('announcement_id = :announcementId', { announcementId })
        .execute();
    }

    await this.updateAnnouncementData(announcementId, {
      subject,
      message,
      publish_date_time,
      send_to,
    });

    return { message: 'Announcement updated successfully!' };
  }

  /**
   * List all announcement
   * @param listAnnouncementData
   * @returns
   */
  async listAnnouncement(listAnnouncementData: ListAnnouncementInput) {
    const { page, pageSize, sortBy } = listAnnouncementData;
    const sortOrder: any = listAnnouncementData.sortOrder;
    const skip = (page - 1) * pageSize;

    if (listAnnouncementData.send_to) {
      await this.validateSendTo(listAnnouncementData.send_to);
    }

    let convertedDate: string | undefined;
    if (listAnnouncementData.publish_date_time) {
      convertedDate = listAnnouncementData.publish_date_time.replace(
        /\//g,
        '-',
      );
    }

    if (
      listAnnouncementData.announcementId &&
      listAnnouncementData.type === 'WITHOUT_PAGINATION'
    ) {
      const announcements = await this.announcementRepository
        .createQueryBuilder('announcement')
        .leftJoinAndSelect(
          'announcement.announcementUserMappings',
          'announcementUserMappings',
        )
        .leftJoinAndSelect('announcementUserMappings.users', 'users')
        .where('announcement.id = :id', {
          id: listAnnouncementData.announcementId,
        })
        .getMany();

      return { announcements };
    } else {
      const queryBuilder: SelectQueryBuilder<Announcement> =
        this.announcementRepository
          .createQueryBuilder('announcement')
          .leftJoinAndSelect(
            'announcement.announcementUserMappings',
            'announcementUserMappings',
          )
          .leftJoinAndSelect('announcementUserMappings.users', 'users')
          .andWhere(
            new Brackets((qb) => {
              if (listAnnouncementData.search) {
                qb.where(
                  '(announcement.subject LIKE :search OR announcement.message LIKE :search)',
                  { search: `%${listAnnouncementData.search}%` },
                );
              }
              if (listAnnouncementData.send_to) {
                qb.andWhere('(announcement.send_to = :send_to)', {
                  send_to: listAnnouncementData.send_to,
                });
              }
              if (
                listAnnouncementData.is_published === 0 ||
                listAnnouncementData.is_published === 1
              ) {
                qb.andWhere('(announcement.is_published = :is_published)', {
                  is_published: listAnnouncementData.is_published,
                });
              }
              if (convertedDate) {
                qb.andWhere('(announcement.publish_date_time LIKE :date)', {
                  date: `%${convertedDate}%`,
                });
              }
            }),
          )
          .skip(skip)
          .take(pageSize)
          .orderBy(
            `announcement.${sortBy}`,
            SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
          );
      const [announcements, total] = await queryBuilder.getManyAndCount();

      return { announcements, total };
    }
  }

  /**
   * List All Users without pagination for announcement specific user selection (parents, teachers)
   * @returns
   */
  async listAllUsers() {
    const [users, total] = await this.userRepository.findAndCount({
      where: [
        { status: STATUS.ACTIVE, role: USER_ROLES.PARENT },
        { status: STATUS.ACTIVE, role: USER_ROLES.TEACHER },
      ],
      select: ['id', 'firstname', 'lastname', 'email', 'role'],
    });

    return { users, total };
  }

  /**
   * Validate User exist with status active function
   * @param userIds
   */
  async validateUserIds(userIds: number[]) {
    for await (const userId of userIds) {
      const user = await this.userRepository.findOne({
        where: { id: userId, status: STATUS.ACTIVE },
      });
      if (!user) {
        throw new GraphQLError(`User not found!`, {
          extensions: {
            statusCode: HttpStatus.NOT_FOUND,
          },
        });
      }
    }
  }

  /**
   * Validate send_to function
   * @param send_to
   */
  async validateSendTo(send_to) {
    if (!Object.values(UserType).includes(send_to)) {
      throw new GraphQLError('Please choose correct type!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  /**
   * Push announcement notification function
   */
  async pushAnnouncementNotification() {
    const currentDateTime = new Date();
    currentDateTime.setSeconds(0);
    currentDateTime.setMilliseconds(0);

    const announcements = await this.announcementRepository
      .createQueryBuilder('announcement')
      .leftJoinAndSelect(
        'announcement.announcementUserMappings',
        'announcementUserMappings',
      )
      .leftJoinAndSelect('announcementUserMappings.users', 'users')
      .where(
        'announcement.is_published = :isPublished AND announcement.status = :status AND announcement.publish_date_time <= :currentDateTime',
        {
          isPublished: IS_PUBLISHED.FALSE,
          status: STATUS.ACTIVE,
          currentDateTime: currentDateTime,
        },
      )
      .getMany();

    const userIds = [];
    for await (const announcement of announcements) {
      if (announcement.send_to === UserType.SPECIFIC) {
        for (const announcementUserMapping of announcement.announcementUserMappings) {
          userIds.push(announcementUserMapping.user_id);
        }
      }

      const users = await this.userRepository
        .createQueryBuilder()
        .where(
          new Brackets((qb) => {
            if (announcement.send_to === UserType.ALL) {
              qb.where(
                'status = :status AND (role = :parentRole OR role = :teacherRole)',
                {
                  status: STATUS.ACTIVE,
                  parentRole: USER_ROLES.PARENT,
                  teacherRole: USER_ROLES.TEACHER,
                },
              );
            }
            if (announcement.send_to === UserType.PARENT) {
              qb.where('status = :status AND role = :parentRole', {
                status: STATUS.ACTIVE,
                parentRole: USER_ROLES.PARENT,
              });
            }
            if (announcement.send_to === UserType.TEACHER) {
              qb.where('status = :status AND role = :teacherRole', {
                status: STATUS.ACTIVE,
                teacherRole: USER_ROLES.TEACHER,
              });
            }
            if (announcement.send_to === UserType.SPECIFIC) {
              qb.where('status = :status AND id IN (:...userIds)', {
                status: STATUS.ACTIVE,
                userIds: userIds,
              });
            }
          }),
        )
        .getMany();

      userIds.length = 0;

      if (users && users.length !== 0) {
        userIds.push(...users.map((user) => user.id));
      }

      const userDevices = await this.userDeviceRepository.find({
        where: {
          user_id: In(userIds),
        },
        select: ['device_token', 'device_type'],
      });

      const notificationData = [];
      userDevices.forEach((device) => {
        const notification: firebase.messaging.Message = {
          token: device.device_token,
          notification: {
            body: announcement.message,
            title: announcement.subject,
          },
          data: {
            notificationMessage: JSON.stringify(announcement.subject),
            type: NOTIFICATION_TYPE.ANNOUNCEMENT,
            notification_type: NOTIFICATION_TYPE.ANNOUNCEMENT,
          },
        };
        notificationData.push(notification);
      });

      await this.notificationService.sendNotification(notificationData);

      await this.announcementRepository.update(
        { id: announcement.id },
        { is_published: IS_PUBLISHED.TRUE },
      );
    }
  }
}
