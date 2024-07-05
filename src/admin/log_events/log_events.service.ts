import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LogEvents } from 'src/database/entities/log_events.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { ListAllLogEventsForAdminInput } from './dto/listAllLogEventsForAdmin.input';
import { SORT_ORDER } from 'src/constants';
import { AwsService } from 'src/aws/aws.service';
import { GraphQLError } from 'graphql';
import { AddLogEventTypeInput } from './dto/addLogEventType.input';
import { LogEventType } from 'src/database/entities/log_event_type.entity';
import { HelperService } from 'src/helper.service';

@Injectable()
export class LogEventsService {
  constructor(
    @Inject('LOG_EVENTS_REPOSITORY')
    private readonly logEventsRepository: Repository<LogEvents>,
    @Inject('LOG_EVENT_TYPE_REPOSITORY')
    private readonly logEventTypeRepository: Repository<LogEventType>,
    private readonly awsService: AwsService,
    private readonly helperService: HelperService,
  ) {}

  /**
   * List All log events with search, event_type and date filter, pagination
   * @param listAllLogEventData
   * @returns
   */
  async listAllLogEvents(listAllLogEventData: ListAllLogEventsForAdminInput) {
    const { page, pageSize, sortBy } = listAllLogEventData;
    const sortOrder: any = listAllLogEventData.sortOrder;
    const skip = (page - 1) * pageSize;

    if (
      listAllLogEventData.type &&
      listAllLogEventData.type === 'WITHOUT_PAGINATION'
    ) {
      const logevents = await this.logEventsRepository.find({
        where: { id: listAllLogEventData.logeventId },
        relations: ['student', 'user', 'log_event_type'],
      });

      return { logevents };
    } else {
      const queryBuilder: SelectQueryBuilder<LogEvents> =
        this.logEventsRepository
          .createQueryBuilder('log_events')
          .leftJoinAndSelect('log_events.student', 'student')
          .leftJoinAndSelect('log_events.user', 'user')
          .leftJoinAndSelect('log_events.log_event_type', 'log_event_type')
          .where(
            new Brackets((qb) => {
              if (listAllLogEventData.search) {
                qb.where(
                  '(log_events.title LIKE :search OR log_events.description LIKE :search OR CONCAT(user.firstname, " ", user.lastname) LIKE :search OR CONCAT(student.firstname, " ", student.lastname) LIKE :search)',
                  { search: `%${listAllLogEventData.search}%` },
                );
              }
              if (listAllLogEventData.date) {
                qb.andWhere('DATE(log_events.createdAt) = :date', {
                  date: listAllLogEventData.date,
                });
              }
              if (listAllLogEventData.event_type) {
                qb.andWhere('log_events.event_type = :eventType', {
                  eventType: listAllLogEventData.event_type,
                });
              }
            }),
          )
          .skip(skip)
          .take(pageSize)
          .orderBy(
            `log_events.${sortBy}`,
            SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
          );

      const [logevents, total] = await queryBuilder.getManyAndCount();

      return { logevents, total };
    }
  }

  /**
   * Delete log event by Id
   * @param logeventId
   */
  async deleteLogEvent(logeventId: number) {
    const isLogEventExist = await this.logEventsRepository.findOne({
      where: { id: logeventId },
    });

    if (!isLogEventExist) {
      throw new GraphQLError('Log event not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await Promise.allSettled(
      isLogEventExist.url_data.map(async (item) => {
        try {
          await this.awsService.removeFromBucket(item.url);
          if (item.type === 'video' && item.video_thumbnail != null) {
            await this.awsService.removeFromBucket(item.video_thumbnail);
          }
        } catch (error) {
          console.error('Error removing image :::', error);
        }
      }),
    );

    await this.logEventsRepository.softDelete({ id: logeventId });

    return { message: 'Log event deleted successfully!' };
  }

  /**
   * Add log event type with image
   * @param addLogEventTypeData
   */
  async AddLogEventType(addLogEventTypeData: AddLogEventTypeInput) {
    if (this.helperService.isBase64(addLogEventTypeData.image_url)) {
      const uploadToAWS = await this.awsService.uploadToAWS(
        'log_event_type_image',
        addLogEventTypeData.image_url,
        'log_event_type',
      );

      addLogEventTypeData.image_url = uploadToAWS.Location;
    } else {
      throw new GraphQLError('Invalid image!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    await this.logEventTypeRepository.save(addLogEventTypeData);

    return { message: 'Log event type added successfully!' };
  }
}
