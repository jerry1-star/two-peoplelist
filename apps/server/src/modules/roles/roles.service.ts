import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: { rolePermissions: { include: { permission: true } } },
    })
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: [{ resource: 'asc' }, { action: 'asc' }] })
  }

  async create(name: string, description?: string) {
    return this.prisma.role.create({ data: { name, description } })
  }

  async update(id: string, data: { name?: string; description?: string }) {
    return this.prisma.role.update({ where: { id }, data })
  }

  async remove(id: string) {
    return this.prisma.role.delete({ where: { id } })
  }

  async updatePermissions(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } })
    if (!role) throw new NotFoundException('角色不存在')

    await this.prisma.rolePermission.deleteMany({ where: { roleId } })
    if (permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      })
    }

    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: { rolePermissions: { include: { permission: true } } },
    })
  }
}
