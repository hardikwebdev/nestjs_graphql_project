import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ExchangeReturnRequest } from 'src/database/entities/exchange_return_request.entity';

@ObjectType()
export class ListExchangeReturnRequestsObjectType {
  @Field(() => Int)
  total: number;

  @Field(() => [ExchangeReturnRequest], { nullable: true })
  exchangeReturnRequests: ExchangeReturnRequest[];
}
