import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty } from 'class-validator';

@InputType()
export class AssignStudentsToTeacherInput {
  @Field(() => [Int])
  @ArrayNotEmpty()
  studentIds: number[];
}
