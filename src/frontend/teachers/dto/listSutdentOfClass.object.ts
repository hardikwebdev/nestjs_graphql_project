import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Students } from 'src/database/entities/student.entity';

@ObjectType()
export class ListStudentOfClassObject {
  @Field(() => Int)
  total: number;

  @Field(() => [Students], { nullable: true })
  students?: Students[];
}
