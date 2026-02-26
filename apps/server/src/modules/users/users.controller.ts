import { Controller, Get, Patch, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'

interface AuthUser { id: string; roles: string[] }

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.findMe(user.id)
  }

  @Patch('me')
  @ApiOperation({ summary: '更新个人资料' })
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto)
  }

  @Get()
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: '获取用户列表（管理员）' })
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.usersService.findAll(Number(page) || 1, Number(pageSize) || 20, keyword)
  }

  @Patch(':id/status')
  @Roles('super_admin', 'admin')
  @ApiOperation({ summary: '封禁/解封用户' })
  updateStatus(@Param('id') id: string, @Body('status') status: 'ACTIVE' | 'BANNED') {
    return this.usersService.updateStatus(id, status)
  }

  @Patch(':id/roles')
  @Roles('super_admin')
  @ApiOperation({ summary: '分配角色' })
  assignRoles(@Param('id') id: string, @Body('roles') roles: string[]) {
    return this.usersService.assignRoles(id, roles)
  }
}
