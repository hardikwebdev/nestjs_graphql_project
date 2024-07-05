import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Students } from 'src/database/entities/student.entity';

@ObjectType()
export class ListStudentOfTeacherObject {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [Students], { nullable: true })
  students?: Students[];
}
