import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { CreateSubscriptionPlanInput } from './dto/createSubscriptionPlan.input';
import { AdminSubscriptionPlanService } from './subscriptionPlan.service';
import { SubscriptionPlanListingObject } from './dto/subscriptionPlanListing.object';
import { GetSubscriptionPlanInput } from './dto/getSubscriptionPlan.input';
import { SubscriptionPlan } from 'src/database/entities/subscription_plan.entity';
import { UpdateSubscriptionPlanInput } from './dto/updateSubscriptionPlan.input';

@Resolver()
export class AdminSubscriptionPlanResolver {
  constructor(
    private readonly adminSubscriptionPlanService: AdminSubscriptionPlanService,
  ) {}

  /**
   * Create subscription plan
   * @param createSubscriptionPlanInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminCreateSubscriptionPlan(
    @Args('createSubscriptionPlanInput')
    createSubscriptionPlanInput: CreateSubscriptionPlanInput,
  ): Promise<MessageObject> {
    return await this.adminSubscriptionPlanService.createSubscriptionPlan(
      createSubscriptionPlanInput,
    );
  }

  /**
   * Get all subscription plan with filter data
   * @param getSubscriptionPlanInput
   * @returns
   */
  @Query(() => SubscriptionPlanListingObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAllSubscriptionPlans(
    @Args('getSubscriptionPlanInput')
    getSubscriptionPlanInput: GetSubscriptionPlanInput,
  ): Promise<SubscriptionPlanListingObject> {
    return await this.adminSubscriptionPlanService.getAllSubscriptionPlans(
      getSubscriptionPlanInput,
    );
  }

  /**
   * Update status of subscription plan by id
   * @param id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateSubscriptionPlanStatus(
    @Args('id', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ): Promise<MessageObject> {
    return await this.adminSubscriptionPlanService.updateSubscriptionPlanStatus(
      id,
      status,
    );
  }

  /**
   * Get subscription plan by id
   * @param id
   * @param status
   * @returns
   */
  @Query(() => SubscriptionPlan)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetSubscriptionPlanById(
    @Args('id', { type: () => ID! }) id: number,
  ): Promise<SubscriptionPlan> {
    return await this.adminSubscriptionPlanService.getSubscriptionPlanById(id);
  }

  /**
   * Update subscription plan by id (only description and name can be updated)
   * @param id
   * @param updateSubscriptionInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateSubscriptionPlanById(
    @Args('id', { type: () => ID! }) id: number,
    @Args('updateSubscriptionInput')
    updateSubscriptionInput: UpdateSubscriptionPlanInput,
  ): Promise<MessageObject> {
    return await this.adminSubscriptionPlanService.updateSubscriptionPlanById(
      id,
      updateSubscriptionInput,
    );
  }
}
