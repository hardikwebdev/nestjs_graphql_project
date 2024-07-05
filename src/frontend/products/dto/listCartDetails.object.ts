import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { UserCartDetails } from 'src/database/entities/cart.entity';

@ObjectType()
export class ListCartDetailsObject extends MessageObject {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [UserCartDetails])
  cart_details: UserCartDetails[];
}
