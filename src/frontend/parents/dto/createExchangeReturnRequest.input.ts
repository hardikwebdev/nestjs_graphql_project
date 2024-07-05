import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ExchangeOrReturnRequestType } from 'src/constants';

@InputType()
export class CreateExchangeReturnRequestInput {
  @Field()
  @IsNotEmpty()
  request_type: ExchangeOrReturnRequestType;

  @Field(() => ID!)
  @IsNotEmpty()
  order_details_id: number;
}
