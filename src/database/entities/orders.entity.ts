import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Users } from './user.entity';
import { OrderDetails } from './order_details.entity';
import { BaseEntity } from '../baseEntity';
import { PaymentStatus } from 'src/constants';

@ObjectType()
@Entity({ name: 'orders' })
export class Orders extends BaseEntity {
  @Field(() => Float)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  total_price: number;

  @Field(() => ID)
  @Column()
  user_id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'enum', enum: PaymentStatus })
  payment_status: PaymentStatus;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  payment_intent_id: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'longtext', nullable: true })
  payment_intent_data: string;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Field(() => [OrderDetails])
  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails[];
}
