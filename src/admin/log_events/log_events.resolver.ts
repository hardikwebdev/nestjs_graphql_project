import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LogEventsService } from './log_events.service';
import { ListAllLogEventsForAdminObject } from './dto/listAllLogEventsForAdmin.object';
import { ListAllLogEventsForAdminInput } from './dto/listAllLogEventsForAdmin.input';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { AddLogEventTypeInput } from './dto/addLogEventType.input';

@Resolver()
export class LogEventsResolver {
  constructor(private readonly logEventService: LogEventsService) {}

  /**
   * List All log events with search, event_type and date filter, pagination
   * @param listAllLogEventData
   * @returns
   */
  @Query(() => ListAllLogEventsForAdminObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminListAllLogEvents(
    @Args('listAllLogEventInput')
    listAllLogEventData: ListAllLogEventsForAdminInput,
  ) {
    return await this.logEventService.listAllLogEvents(listAllLogEventData);
  }

  /**
   * Delete log event by Id
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteLogEvent(
    @Args('logeventId', { type: () => ID! }) id: number,
  ) {
    return await this.logEventService.deleteLogEvent(id);
  }

  /**
   * Add log event type with image
   * @param addLogEventTypeData
   * @returns
   */
  @Mutation(() => MessageObject)
  async adminAddLogEventType(
    @Args('addLogEventTypeInput') addLogEventTypeData: AddLogEventTypeInput,
  ) {
    return await this.logEventService.AddLogEventType(addLogEventTypeData);
  }
}
