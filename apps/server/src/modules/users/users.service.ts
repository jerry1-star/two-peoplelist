import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    })
    if (!user) throw new NotFoundException('用户不存在')
    return {
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
      userRoles: undefined,
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    })
  }

  async findAll(page = 1, pageSize = 20, keyword?: string) {
    const skip = (page - 1) * pageSize
    const where = keyword ? {
      OR: [
        { nickname: { contains: keyword } },
        { phone: { contains: keyword } },
      ],
    } : {}

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        include: { userRoles: { include: { role: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      data: data.map((u) => ({ ...u, roles: u.userRoles.map((ur) => ur.role.name), userRoles: undefined })),
      total,
      page,
      pageSize,
    }
  }

  async updateStatus(userId: string, status: 'ACTIVE' | 'BANNED') {
    return this.prisma.user.update({ where: { id: userId }, data: { status } })
  }

  async assignRoles(userId: string, roleNames: string[]) {
    const roles = await this.prisma.role.findMany({ where: { name: { in: roleNames } } })
    await this.prisma.userRole.deleteMany({ where: { userId } })
    await this.prisma.userRole.createMany({
      data: roles.map((r) => ({ userId, roleId: r.id })),
    })
    return this.findMe(userId)
  }
}
