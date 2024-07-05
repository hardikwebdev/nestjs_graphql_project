import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LogEvents } from 'src/database/entities/log_events.entity';

@ObjectType()
export class ListLogEventObject {
  @Field(() => Int)
  total: string;

  @Field(() => [LogEvents])
  logevents: LogEvents[];
}
