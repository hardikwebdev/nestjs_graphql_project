import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { LOG_EVENTS_TYPE } from 'src/constants';
import { LogEvents } from './log_events.entity';

@ObjectType()
@Entity({ name: 'log_event_type' })
export class LogEventType extends BaseEntity {
  @Field()
  @Column({ type: 'enum', enum: LOG_EVENTS_TYPE })
  event_type: LOG_EVENTS_TYPE;

  @Field()
  @Column()
  image_url: string;

  @Field(() => [LogEvents])
  @OneToMany(() => LogEvents, (logEvents) => logEvents.log_event_type)
  log_events: LogEvents[];
}
