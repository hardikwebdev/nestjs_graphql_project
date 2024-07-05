import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import {
  IS_AUTO_RENEW,
  SUBSCRIPTION_CRON_CHECK,
  SUBSCRIPTION_DEVICE_TYPE,
} from 'src/constants';
import { Users } from './user.entity';
import { SubscriptionPlan } from './subscription_plan.entity';

@ObjectType()
@Entity({ name: 'subscribed_users' })
export class SubscribedUser extends BaseEntity {
  @Field()
  @Column()
  transaction_id: string;

  @Field()
  @Column({
    type: 'enum',
    enum: SUBSCRIPTION_DEVICE_TYPE,
    default: SUBSCRIPTION_DEVICE_TYPE.IOS,
  })
  device_type: SUBSCRIPTION_DEVICE_TYPE;

  @Field()
  @Column({
    type: 'text',
  })
  receipt: string;

  @Field()
  @Column({
    type: 'timestamp',
  })
  start_date: Date;

  @Field()
  @Column({
    type: 'timestamp',
  })
  end_date: Date;

  @Field(() => ID)
  @Column()
  user_id: number;

  @Field(() => ID)
  @Column()
  plan_id: number;

  @Field(() => Int)
  @Column({
    type: 'tinyint',
    default: SUBSCRIPTION_CRON_CHECK.ACTIVE,
    comment: '0: Cancelled, 1: Active, 2: Completed',
  })
  cron_check: number;

  @Field(() => Int)
  @Column({
    type: 'tinyint',
    default: IS_AUTO_RENEW.TRUE,
    comment: '0: False, 1: True',
  })
  auto_renew: number;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.subscribed_user)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Field(() => SubscriptionPlan)
  @ManyToOne(
    () => SubscriptionPlan,
    (subscriptionPlan) => subscriptionPlan.subscribed_user,
  )
  @JoinColumn({ name: 'plan_id' })
  subscription_plan: SubscriptionPlan;
}
