import { Module } from '@nestjs/common';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DashboardResolver, DashboardService],
})
export class DashboardModule {}
