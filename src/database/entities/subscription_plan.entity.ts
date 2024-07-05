import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { STATUS, SubscriptionPlanInterval } from 'src/constants';
import { SubscribedUser } from './subscribed_users.entity';

@ObjectType()
@Entity({ name: 'subscription_plan' })
export class SubscriptionPlan extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'longtext' })
  description: string;

  @Field()
  @Column()
  android_plan_id: string;

  @Field()
  @Column()
  ios_plan_id: string;

  @Field(() => Float)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  price: number;

  @Field(() => Int)
  @Column({
    type: 'enum',
    enum: SubscriptionPlanInterval,
    default: SubscriptionPlanInterval.MONTHLY,
  })
  interval: SubscriptionPlanInterval;

  @Field(() => Int)
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active',
  })
  status: number;

  @Field(() => [SubscribedUser])
  @OneToMany(
    () => SubscribedUser,
    (subscribedUser) => subscribedUser.subscription_plan,
  )
  subscribed_user: SubscribedUser[];
}
