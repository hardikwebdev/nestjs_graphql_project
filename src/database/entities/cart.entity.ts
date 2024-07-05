import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Products } from './product.entity';
import { Users } from './user.entity';
import { BaseEntity } from '../baseEntity';
import { CART_ITEM_STATUS } from 'src/constants';

@ObjectType()
@Entity({ name: 'user_cart_details' })
export class UserCartDetails extends BaseEntity {
  @Field(() => ID)
  @Column()
  product_id: number;

  @Field(() => ID)
  @Column()
  user_id: number;

  @Field()
  @Column({ default: 0 })
  quantity: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: CART_ITEM_STATUS.PENDING,
    comment: '0: Pending, 1: Ordered',
  })
  status: number;

  @Field(() => Products)
  @ManyToOne(() => Products, (products) => products.user_cart_details)
  @JoinColumn({ name: 'product_id' })
  products: Products;

  @Field(() => Users)
  @ManyToOne(() => Users, (users) => users.user_cart_details)
  @JoinColumn({ name: 'user_id' })
  users: Users;
}
