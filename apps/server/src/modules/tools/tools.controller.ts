import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ToolsService } from './tools.service'
import { CreateToolDto } from './dto/create-tool.dto'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('tools')
@ApiBearerAuth()
@Controller('tools')
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取工具列表' })
  findAll(
    @Query('category') category?: string,
    @Query('recommended') recommended?: string,
    @Query('page') page?: string,
    @Query('pageSize') ps?: string,
  ) {
    return this.toolsService.findAll(category, recommended === 'true', Number(page) || 1, Number(ps) || 20)
  }

  @Get('admin')
  @Roles('super_admin', 'admin')
  findAllAdmin(@Query('page') page?: string, @Query('pageSize') ps?: string) {
    return this.toolsService.findAllAdmin(Number(page) || 1, Number(ps) || 20)
  }

  @Post()
  @Roles('super_admin', 'admin')
  create(@Body() dto: CreateToolDto) {
    return this.toolsService.create(dto)
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreateToolDto>) {
    return this.toolsService.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin', 'admin')
  remove(@Param('id') id: string) {
    return this.toolsService.remove(id)
  }
}
