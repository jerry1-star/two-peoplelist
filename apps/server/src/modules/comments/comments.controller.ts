import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Public } from '../../common/decorators/public.decorator'

interface AuthUser { id: string }

@ApiTags('comments')
@ApiBearerAuth()
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取帖子评论' })
  findByPost(@Param('postId') postId: string, @Query('page') page?: string, @Query('pageSize') ps?: string) {
    return this.commentsService.findByPost(postId, Number(page) || 1, Number(ps) || 20)
  }

  @Post()
  @ApiOperation({ summary: '发表评论' })
  create(@Param('postId') postId: string, @CurrentUser() user: AuthUser, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(postId, user.id, dto.content)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评论' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.commentsService.remove(id, user.id)
  }
}
