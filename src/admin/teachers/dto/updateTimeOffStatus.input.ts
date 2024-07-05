import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateTimeOffRequestInput {
  @Field(() => ID)
  teacherId: number;

  @Field(() => Int)
  status: number;
}
