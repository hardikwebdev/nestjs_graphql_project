import { Inject, Injectable } from '@nestjs/common';
import { STATUS } from 'src/constants';
import { SubscriptionPlan } from 'src/database/entities/subscription_plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FrontEndSubscriptionPlanService {
  constructor(
    @Inject('SUBSCRIPTION_PLAN_REPOSITORY')
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
  ) {}

  /**
   * Get all active subscription plans
   * @returns
   */
  async getAllActiveSubscriptionPlans() {
    const plans = await this.subscriptionPlanRepository.find({
      where: {
        status: STATUS.ACTIVE,
      },
    });
    return plans;
  }
}
