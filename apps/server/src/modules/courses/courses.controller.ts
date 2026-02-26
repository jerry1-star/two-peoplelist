import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { CoursesService } from './courses.service'
import { CreateCourseDto } from './dto/create-course.dto'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取课程列表' })
  findAll(@Query('all') all?: string) {
    return this.coursesService.findAll(all !== 'true')
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取课程详情' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id)
  }

  @Post()
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: '创建课程' })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto)
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: '更新课程' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCourseDto>) {
    return this.coursesService.update(id, dto)
  }

  @Delete(':id')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: '删除课程' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id)
  }
}
