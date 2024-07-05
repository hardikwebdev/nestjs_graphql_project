import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ListOrderDetailsObject {
  @Field(() => Int)
  total: string;

  @Field(() => [ListOrderDetail], { nullable: true })
  orders: ListOrderDetail[];
}

@ObjectType()
export class ListOrderDetail {
  @Field(() => ID)
  id: number;

  @Field(() => Float)
  total_price: number;

  @Field(() => String, { nullable: true })
  payment_status: string;

  @Field(() => [OrderDetailsObject])
  orderDetails: OrderDetailsObject[];
}

@ObjectType()
class ProductObject {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => [String], { nullable: true })
  imageUrl: string[];
}

@ObjectType()
class OrderDetailsObject {
  @Field(() => ID)
  id: number;

  @Field(() => Float)
  price: number;

  @Field(() => Int, { nullable: true })
  quantity: number;

  @Field(() => ProductObject, { nullable: true })
  product: ProductObject;
}
