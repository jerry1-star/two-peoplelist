import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { DashboardService } from './dashboard.service'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@Roles('super_admin', 'admin')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: '获取数据看板统计' })
  getStats() {
    return this.dashboardService.getStats()
  }
}
