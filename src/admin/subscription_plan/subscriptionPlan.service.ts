import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SubscriptionPlan } from 'src/database/entities/subscription_plan.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateSubscriptionPlanInput } from './dto/createSubscriptionPlan.input';
import { GetSubscriptionPlanInput } from './dto/getSubscriptionPlan.input';
import { SORT_ORDER, STATUS } from 'src/constants';
import { GraphQLError } from 'graphql';
import { UpdateSubscriptionPlanInput } from './dto/updateSubscriptionPlan.input';

@Injectable()
export class AdminSubscriptionPlanService {
  constructor(
    @Inject('SUBSCRIPTION_PLAN_REPOSITORY')
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
  ) { }

  /**
   * Get subscription plan by id
   * @param id
   */
  async getSubscriptionPlanById(id: number) {
    const subscriptionPlan = await this.subscriptionPlanRepository.findOneBy({
      id,
    });

    if (!subscriptionPlan) {
      throw new GraphQLError('Subscription plan not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return subscriptionPlan;
  }

  /**
   * Create subscription plan
   * @param createSubscriptionPlanInput
   */
  async createSubscriptionPlan(
    createSubscriptionPlanInput: CreateSubscriptionPlanInput,
  ) {
    await this.subscriptionPlanRepository.save(createSubscriptionPlanInput);
    return { message: 'Subscription plan created successfully!' };
  }

  /**
   * Get all subscription plan with filter
   * @param getSubscriptionPlanInput
   */
  async getAllSubscriptionPlans(
    getSubscriptionPlanInput: GetSubscriptionPlanInput,
  ) {
    const { page, pageSize, sortBy, search, status } = getSubscriptionPlanInput;
    const skip = (page - 1) * pageSize;
    const sortOrder: any = getSubscriptionPlanInput.sortOrder;
    const queryBuilder: SelectQueryBuilder<SubscriptionPlan> =
      this.subscriptionPlanRepository
        .createQueryBuilder('subscription_plans')
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `subscription_plans.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );
    if (search && search != '') {
      queryBuilder.andWhere(
        '(subscription_plans.name LIKE :search OR subscription_plans.description LIKE :search OR subscription_plans.price= :price)',
        {
          search: `%${search}%`,
          price: search,
        },
      );
    }
    if (status == STATUS.ACTIVE || status == STATUS.INACTIVE) {
      queryBuilder.andWhere('(subscription_plans.status = :status)', {
        status,
      });
    }
    const [subscription_plans, total] = await queryBuilder.getManyAndCount();
    return { subscription_plans, total };
  }

  /**
   * Update subscription plan status
   * @param id
   * @param status
   * @returns
   */
  async updateSubscriptionPlanStatus(id: number, status: number) {
    await this.getSubscriptionPlanById(id);
    await this.updateSubscriptionPlan({ id }, { status });
    return { message: 'Subscription plan updated successfully!' };
  }

  /**
   * Update subscription plan by where option and update data
   * @param whereOption
   * @param updateData
   */
  async updateSubscriptionPlan(
    whereOption: Partial<SubscriptionPlan>,
    updateData: Partial<SubscriptionPlan>,
  ) {
    await this.subscriptionPlanRepository.update(whereOption, updateData);
    return;
  }

  /**
   * Delete subscription plan by id
   * @param id
   * @returns
   */
  async deleteSunscriptionPlanById(id: number) {
    await this.getSubscriptionPlanById(id);
    await this.updateSubscriptionPlan({ id }, { deletedAt: new Date() });
    return { message: 'Subscription plan deleted successfully!' };
  }

  /**
   * Update subscription plan by id
   * @param id
   * @param updateData
   * @returns
   */
  async updateSubscriptionPlanById(
    id: number,
    updateData: UpdateSubscriptionPlanInput,
  ) {
    await this.getSubscriptionPlanById(id);
    await this.updateSubscriptionPlan({ id }, updateData);
    return { message: 'Subscription plan updated successfully!' };
  }
}
