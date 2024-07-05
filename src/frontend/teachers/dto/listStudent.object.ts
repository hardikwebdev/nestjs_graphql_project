import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Students } from 'src/database/entities/student.entity';

@ObjectType()
export class ListStudentsObjectType {
  @Field(() => Int)
  total: number;

  @Field(() => [Students])
  students: Students[];
}
