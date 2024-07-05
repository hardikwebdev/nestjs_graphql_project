import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { LOG_EVENTS_TYPE } from 'src/constants';
import { BaseEntity } from 'src/database/baseEntity';
import { UrlData } from 'src/database/entities/log_events.entity';

@ObjectType()
class LogEventTypeData {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  type: LOG_EVENTS_TYPE;

  @Field()
  image_url: string;
}

@ObjectType()
class LogEventObject extends BaseEntity {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => ID)
  teacher_id: number;

  @Field(() => ID)
  student_id: number;

  @Field(() => [UrlData], { nullable: true })
  url_data: UrlData[];

  @Field(() => LogEventTypeData, { nullable: true })
  log_event_type: LogEventTypeData;
}

@ObjectType()
export class AddLogEventObject extends MessageObject {
  @Field(() => LogEventObject)
  logEvent: LogEventObject;
}
