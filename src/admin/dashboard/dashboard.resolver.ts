import { Query, Resolver } from '@nestjs/graphql';
import { TotalCountsObject } from './dto/totalCount.object';
import { DashboardService } from './dashboard.service';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get Total Schools, Teachers, Parents/Students, Unassigned Parents/Students, sick-time_off, reimbursement Count
   * @returns
   */
  @Query(() => TotalCountsObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetTotalCount() {
    return await this.dashboardService.getTotalCount();
  }
}
