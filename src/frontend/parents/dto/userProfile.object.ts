import { ObjectType, Field } from '@nestjs/graphql';
import { Users } from '../../../database/entities/user.entity';
import { Students } from 'src/database/entities/student.entity';
@ObjectType()
export class UserProfileType {
  @Field(() => Users)
  userProfile: Users;

  @Field(() => [Students], { nullable: true })
  students?: Students[];
}
