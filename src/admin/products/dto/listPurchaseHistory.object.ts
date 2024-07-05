import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderDetails } from 'src/database/entities/order_details.entity';

@ObjectType()
export class ListPurchaseHistoryObjectType {
  @Field(() => Int)
  total: number;

  @Field(() => [OrderDetails], { nullable: true })
  orderDetails: OrderDetails[];
}
