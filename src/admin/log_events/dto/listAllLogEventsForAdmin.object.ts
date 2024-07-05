import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LogEvents } from 'src/database/entities/log_events.entity';

@ObjectType()
export class ListAllLogEventsForAdminObject {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [LogEvents])
  logevents: LogEvents[];
}
