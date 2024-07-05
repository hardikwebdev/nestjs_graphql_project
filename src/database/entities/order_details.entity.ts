import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Orders } from './orders.entity';
import { BaseEntity } from '../baseEntity';
import { Products } from './product.entity';
import { IS_RETURNED_OR_EXCHANGED } from 'src/constants';
import { ExchangeReturnRequest } from './exchange_return_request.entity';

export enum ShippingStatus {
  ORDERED = 'ordered',
  DELIVERED = 'delivered',
  SHIPPED = 'shipped',
  PICK_FOR_DELEVERY = 'picked_up_for_delevery',
  CANCELED = 'canceled',
}
@ObjectType()
@Entity({ name: 'order_details' })
export class OrderDetails extends BaseEntity {
  @Field(() => Float)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Field(() => Int)
  @Column()
  quantity: number; // product_price * quantity

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: ShippingStatus,
    default: ShippingStatus.ORDERED,
  })
  shipping_status: ShippingStatus;

  @Field(() => ID)
  @Column()
  order_id: number;

  @Field(() => ID)
  @Column()
  product_id: number;

  @Field(() => Int)
  @Column({
    default: IS_RETURNED_OR_EXCHANGED.FALSE,
  })
  is_returned: number;

  @Field(() => Int)
  @Column({
    default: IS_RETURNED_OR_EXCHANGED.FALSE,
    type: 'tinyint',
  })
  is_exchanged: number;

  @Field(() => Orders, { nullable: true })
  @ManyToOne(() => Orders, (orders) => orders.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  @Field(() => Products, { nullable: true })
  @ManyToOne(() => Products, (products) => products.orderDetails)
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @Field(() => [ExchangeReturnRequest], { nullable: true })
  @OneToMany(
    () => ExchangeReturnRequest,
    (exchangeReturnRequests) => exchangeReturnRequests.orderDetails,
  )
  exchangeReturnRequests: ExchangeReturnRequest[];
}
