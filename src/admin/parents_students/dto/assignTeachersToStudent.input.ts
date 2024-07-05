import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty } from 'class-validator';

@InputType()
export class AssignTeachersToStudentInput {
  @Field(() => [Int])
  @ArrayNotEmpty()
  teacherIds: number[];
}
