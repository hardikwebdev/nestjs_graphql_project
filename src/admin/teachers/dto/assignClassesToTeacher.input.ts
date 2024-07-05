import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty } from 'class-validator';

@InputType()
export class AssignClassesToTeacherInput {
  @Field(() => [ID!]!)
  @ArrayNotEmpty()
  classIds: number[];
}
