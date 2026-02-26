import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { LearningRecordsService } from './learning-records.service'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

interface AuthUser { id: string }

@ApiTags('learning-records')
@ApiBearerAuth()
@Controller('learning-records')
export class LearningRecordsController {
  constructor(private service: LearningRecordsService) {}

  @Get('me')
  @ApiOperation({ summary: '获取我的学习记录' })
  getMyRecords(@CurrentUser() user: AuthUser) {
    return this.service.getMyRecords(user.id)
  }

  @Post()
  @ApiOperation({ summary: '更新学习进度' })
  upsert(
    @CurrentUser() user: AuthUser,
    @Body('courseId') courseId: string,
    @Body('progress') progress: number,
  ) {
    return this.service.upsert(user.id, courseId, progress)
  }
}
