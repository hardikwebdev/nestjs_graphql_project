import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserAttendenceType } from 'src/database/entities/user_attendance.entity';

@ObjectType()
class UserRecentLogsData {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => String, { nullable: true })
  type: UserAttendenceType;

  @Field(() => String, { nullable: true })
  date: Date;

  @Field(() => Int, { nullable: true })
  logged_hours: number;

  @Field(() => Int, { nullable: true })
  timeOff_hours: number;

  @Field(() => ID)
  user_id: number;
}

@ObjectType()
export class ListRecentLogsObject {
  @Field(() => Int)
  total: number;

  @Field(() => [UserRecentLogsData])
  userRecentLogs: UserRecentLogsData[];
}
