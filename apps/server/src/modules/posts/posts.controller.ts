import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { ReviewPostDto } from './dto/review-post.dto'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'
import { Roles } from '../../common/decorators/roles.decorator'

interface AuthUser { id: string; roles: string[] }

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取已审核帖子列表' })
  findAll(@Query('page') page?: string, @Query('pageSize') ps?: string, @Query('categoryId') cid?: string) {
    return this.postsService.findAll(Number(page) || 1, Number(ps) || 20, cid)
  }

  @Get('admin')
  @Roles('super_admin', 'admin', 'moderator')
  @ApiOperation({ summary: '获取所有帖子（管理员）' })
  findAllAdmin(@Query('page') page?: string, @Query('pageSize') ps?: string, @Query('status') status?: string) {
    return this.postsService.findAllAdmin(Number(page) || 1, Number(ps) || 20, status)
  }

  @Get('mine')
  @ApiOperation({ summary: '获取我的帖子' })
  getMine(@CurrentUser() user: AuthUser, @Query('page') page?: string, @Query('pageSize') ps?: string) {
    return this.postsService.getMyPosts(user.id, Number(page) || 1, Number(ps) || 20)
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: '获取分类列表' })
  getCategories() {
    return this.postsService.getCategories()
  }

  @Post('categories')
  @Roles('super_admin', 'admin')
  createCategory(@Body('name') name: string, @Body('description') description?: string) {
    return this.postsService.createCategory(name, description)
  }

  @Delete('categories/:id')
  @Roles('super_admin', 'admin')
  deleteCategory(@Param('id') id: string) {
    return this.postsService.deleteCategory(id)
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取帖子详情' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: '发布帖子' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新帖子' })
  update(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body() dto: Partial<CreatePostDto>) {
    const isAdmin = user.roles?.some((r) => ['super_admin', 'admin'].includes(r)) ?? false
    return this.postsService.update(id, user.id, dto, isAdmin)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除帖子' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const isAdmin = user.roles?.some((r) => ['super_admin', 'admin'].includes(r)) ?? false
    return this.postsService.remove(id, user.id, isAdmin)
  }

  @Patch(':id/review')
  @Roles('super_admin', 'admin', 'moderator')
  @ApiOperation({ summary: '审核帖子' })
  review(@Param('id') id: string, @Body() dto: ReviewPostDto) {
    return this.postsService.review(id, dto.status)
  }
}
