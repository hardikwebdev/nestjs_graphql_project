import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ListCartDetailsInput {
  @Field(() => ID)
  @IsNotEmpty()
  product_id: number;
}
