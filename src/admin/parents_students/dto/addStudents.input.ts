import { Field, InputType } from '@nestjs/graphql';
import { StudentInputType } from './createParent.input';
import { ArrayNotEmpty } from 'class-validator';

@InputType()
export class AddStudentsInput {
  @Field(() => [StudentInputType])
  @ArrayNotEmpty()
  students: StudentInputType[];
}
