import { Field, InputType } from '@nestjs/graphql';
import { UpdateStudentInputType } from './updateParent.input';
import { ArrayNotEmpty } from 'class-validator';

@InputType()
export class UpdateStudentsInput {
  @Field(() => [UpdateStudentInputType])
  @ArrayNotEmpty()
  students: UpdateStudentInputType[];
}
