import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { posts: true } } },
    })
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({ where: { name: dto.name } })
    if (exists) throw new ConflictException('分类名称已存在')
    return this.prisma.category.create({ data: dto })
  }

  async update(id: string, dto: Partial<CreateCategoryDto>) {
    const category = await this.prisma.category.findUnique({ where: { id } })
    if (!category) throw new NotFoundException('分类不存在')
    if (dto.name && dto.name !== category.name) {
      const exists = await this.prisma.category.findUnique({ where: { name: dto.name } })
      if (exists) throw new ConflictException('分类名称已存在')
    }
    return this.prisma.category.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    })
    if (!category) throw new NotFoundException('分类不存在')
    if (category._count.posts > 0) throw new ConflictException('该分类下还有帖子，无法删除')
    return this.prisma.category.delete({ where: { id } })
  }
}
