import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SubscriptionPlan } from 'src/database/entities/subscription_plan.entity';

@ObjectType()
export class SubscriptionPlanListingObject {
  @Field(() => Int)
  total: number;

  @Field(() => [SubscriptionPlan])
  subscription_plans: SubscriptionPlan[];
}
