import { Query, Resolver } from '@nestjs/graphql';
import { FrontEndSubscriptionPlanService } from './subscriptionPlan.service';
import { SubscriptionPlan } from 'src/database/entities/subscription_plan.entity';
import { JwtParentAuthGuard } from 'src/guards/parent_guard/parent_jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class FrontEndSubscriptionPlanResolver {
  constructor(
    private readonly frontEndSubscriptionPlanService: FrontEndSubscriptionPlanService,
  ) {}

  /**
   * Get all active subscription plans
   * @returns
   */
  @Query(() => [SubscriptionPlan])
  @UseGuards(JwtParentAuthGuard)
  async getAllActiveSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await this.frontEndSubscriptionPlanService.getAllActiveSubscriptionPlans();
  }
}
