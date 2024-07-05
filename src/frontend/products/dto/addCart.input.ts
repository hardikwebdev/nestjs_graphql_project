import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @IsNotEmpty()
  product_id: number;

  @Field(() => Int)
  @IsNotEmpty()
  quantity: number;
}
