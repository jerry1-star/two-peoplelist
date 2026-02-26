import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateToolDto } from './dto/create-tool.dto'

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryName?: string, recommended?: boolean, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize
    const where = {
      isPublished: true,
      ...(categoryName ? { categoryName } : {}),
      ...(recommended ? { isRecommended: true } : {}),
    }
    const [data, total] = await Promise.all([
      this.prisma.tool.findMany({ where, skip, take: pageSize, orderBy: { sortOrder: 'asc' } }),
      this.prisma.tool.count({ where }),
    ])
    return { data, total, page, pageSize }
  }

  async findAllAdmin(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize
    const [data, total] = await Promise.all([
      this.prisma.tool.findMany({ skip, take: pageSize, orderBy: { sortOrder: 'asc' } }),
      this.prisma.tool.count(),
    ])
    return { data, total, page, pageSize }
  }

  async create(dto: CreateToolDto) {
    return this.prisma.tool.create({ data: { ...dto, tags: dto.tags ?? [] } })
  }

  async update(id: string, dto: Partial<CreateToolDto>) {
    return this.prisma.tool.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    const tool = await this.prisma.tool.findUnique({ where: { id } })
    if (!tool) throw new NotFoundException('工具不存在')
    return this.prisma.tool.delete({ where: { id } })
  }
}
