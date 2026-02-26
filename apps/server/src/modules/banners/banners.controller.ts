import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { BannersService } from './banners.service'
import { CreateBannerDto } from './dto/create-banner.dto'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('banners')
@ApiBearerAuth()
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取活跃 Banner' })
  findActive(@Query('position') position?: 'HOME_TOP' | 'HOME_MIDDLE') {
    return this.bannersService.findActive(position)
  }

  @Get('admin')
  @Roles('super_admin', 'admin')
  findAll() {
    return this.bannersService.findAll()
  }

  @Post()
  @Roles('super_admin', 'admin')
  create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create(dto)
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreateBannerDto>) {
    return this.bannersService.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin', 'admin')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id)
  }
}
