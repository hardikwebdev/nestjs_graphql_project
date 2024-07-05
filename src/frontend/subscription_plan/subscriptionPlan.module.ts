import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FrontEndSubscriptionPlanResolver } from './subscriptionPlan.resolver';
import { FrontEndSubscriptionPlanService } from './subscriptionPlan.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    FrontEndSubscriptionPlanResolver,
    FrontEndSubscriptionPlanService,
  ],
})
export class FrontEndSubscriptionPlanModule {}
