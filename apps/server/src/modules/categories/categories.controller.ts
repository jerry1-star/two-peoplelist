import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Public } from '../../common/decorators/public.decorator'

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取所有分类' })
  findAll() {
    return this.categoriesService.findAll()
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: '创建分类（管理员）' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto)
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: '更新分类（管理员）' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCategoryDto>) {
    return this.categoriesService.update(id, dto)
  }

  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除分类（管理员）' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id)
  }
}
