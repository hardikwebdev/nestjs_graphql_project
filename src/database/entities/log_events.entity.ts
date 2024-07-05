import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';
import { Students } from './student.entity';
import { LogEventType } from './log_event_type.entity';

@ObjectType()
export class UrlData {
  @Field()
  url: string;

  @Field()
  type: string;

  @Field(() => String, { nullable: true })
  duration: string;

  @Field(() => String, { nullable: true })
  video_thumbnail: string;
}

@ObjectType()
@Entity({ name: 'log_events' })
export class LogEvents extends BaseEntity {
  @Field(() => ID)
  @Column({
    comment: 'type of log event',
    nullable: true,
  })
  event_type_id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: 'longtext' })
  description: string;

  @Field(() => ID)
  @Column({ comment: 'teacher who created this log event' })
  teacher_id: number;

  @Field(() => ID)
  @Column()
  student_id: number;

  @Field(() => [UrlData])
  @Column({ type: 'json' })
  url_data: UrlData[];

  @Field(() => Users)
  @ManyToOne(() => Users, (users) => users.log_events)
  @JoinColumn({ name: 'teacher_id' })
  user: Users;

  @Field(() => Students)
  @ManyToOne(() => Students, (students) => students.log_events)
  @JoinColumn({ name: 'student_id' })
  student: Students;

  @Field(() => LogEventType)
  @ManyToOne(() => LogEventType, (logEventType) => logEventType.log_events)
  @JoinColumn({ name: 'event_type_id' })
  log_event_type: LogEventType;
}
