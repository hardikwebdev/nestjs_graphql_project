import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty } from 'class-validator';

@InputType()
export class AssignSchoolToParentInput {
  @Field(() => [ID])
  @ArrayNotEmpty()
  schoolIds: number[];
}
