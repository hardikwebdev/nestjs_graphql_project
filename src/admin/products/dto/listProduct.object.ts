import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Products } from 'src/database/entities/product.entity';

@ObjectType()
export class ListProductObjectType {
  @Field(() => Int)
  total: number;

  @Field(() => [Products], { nullable: true })
  products: Products[];

  @Field(() => Int, { nullable: true })
  totat_cart_items: number;
}
