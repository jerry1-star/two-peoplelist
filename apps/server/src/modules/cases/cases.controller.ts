import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { CasesService } from './cases.service'
import { CreateCaseDto } from './dto/create-case.dto'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('cases')
@ApiBearerAuth()
@Controller('cases')
export class CasesController {
  constructor(private casesService: CasesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取成功案例列表' })
  findAll(@Query('page') page?: string, @Query('pageSize') ps?: string) {
    return this.casesService.findAll(Number(page) || 1, Number(ps) || 20)
  }

  @Get('admin')
  @Roles('super_admin', 'admin')
  findAllAdmin(@Query('page') page?: string, @Query('pageSize') ps?: string) {
    return this.casesService.findAllAdmin(Number(page) || 1, Number(ps) || 20)
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.casesService.findOne(id)
  }

  @Post()
  @Roles('super_admin', 'admin')
  create(@Body() dto: CreateCaseDto) {
    return this.casesService.create(dto)
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreateCaseDto>) {
    return this.casesService.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin', 'admin')
  remove(@Param('id') id: string) {
    return this.casesService.remove(id)
  }
}
