import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AdminSubscriptionPlanResolver } from './subscriptionPlan.resolver';
import { AdminSubscriptionPlanService } from './subscriptionPlan.service';

@Module({
  imports: [DatabaseModule],
  providers: [AdminSubscriptionPlanResolver, AdminSubscriptionPlanService],
})
export class AdminSubscriptionPlanModule {}
