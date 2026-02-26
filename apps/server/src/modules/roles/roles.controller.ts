import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { RolesService } from './roles.service'
import { Roles } from '../../common/decorators/roles.decorator'

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@Roles('super_admin')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: '获取角色列表' })
  findAll() {
    return this.rolesService.findAll()
  }

  @Get('permissions')
  @ApiOperation({ summary: '获取所有权限' })
  findAllPermissions() {
    return this.rolesService.findAllPermissions()
  }

  @Post()
  @ApiOperation({ summary: '创建角色' })
  create(@Body('name') name: string, @Body('description') description?: string) {
    return this.rolesService.create(name, description)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新角色' })
  update(@Param('id') id: string, @Body() data: { name?: string; description?: string }) {
    return this.rolesService.update(id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id)
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: '更新角色权限矩阵' })
  updatePermissions(@Param('id') id: string, @Body('permissionIds') permissionIds: string[]) {
    return this.rolesService.updatePermissions(id, permissionIds)
  }
}
