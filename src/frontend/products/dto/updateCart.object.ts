import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput {
  @Field(() => Int)
  quantity: number;
}
