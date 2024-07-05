import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRecentLogs } from 'src/database/entities/user_recent_logs.entity';

@ObjectType()
export class ListTeachersSickRequestObject {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [UserRecentLogs])
  sick_requests: UserRecentLogs[];
}
