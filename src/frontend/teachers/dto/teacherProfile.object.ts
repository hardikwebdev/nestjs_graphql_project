import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Users } from 'src/database/entities/user.entity';
import { SchoolInfo } from './school.object';

@ObjectType()
export class TeacherProfileObjectType {
  @Field(() => Users)
  user?: Users;

  @Field(() => [SchoolInfo], { nullable: true })
  schoolData?: SchoolInfo[];

  @Field(() => Int, { nullable: true })
  remaining_document_count: number;
}
