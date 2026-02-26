import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'

const authorSelect = { id: true, nickname: true, avatar: true }

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20, categoryId?: string) {
    const skip = (page - 1) * pageSize
    const where = { status: 'APPROVED' as const, ...(categoryId ? { categoryId } : {}) }
    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          author: { select: authorSelect },
          category: true,
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ])
    return {
      data: data.map((p) => ({ ...p, commentCount: p._count.comments, _count: undefined })),
      total,
      page,
      pageSize,
    }
  }

  async findAllAdmin(page = 1, pageSize = 20, status?: string) {
    const skip = (page - 1) * pageSize
    const where = status ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' } : {}
    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        include: { author: { select: authorSelect }, category: true, _count: { select: { comments: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ])
    return {
      data: data.map((p) => ({ ...p, commentCount: p._count.comments, _count: undefined })),
      total,
      page,
      pageSize,
    }
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: authorSelect }, category: true },
    })
    if (!post) throw new NotFoundException('帖子不存在')
    await this.prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } })
    return post
  }

  async create(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: { ...dto, authorId: userId, status: 'PENDING' },
      include: { author: { select: authorSelect }, category: true },
    })
  }

  async update(id: string, userId: string, data: Partial<CreatePostDto>, isAdmin = false) {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('帖子不存在')
    if (!isAdmin && post.authorId !== userId) throw new ForbiddenException('无权操作')
    return this.prisma.post.update({ where: { id }, data })
  }

  async remove(id: string, userId: string, isAdmin = false) {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('帖子不存在')
    if (!isAdmin && post.authorId !== userId) throw new ForbiddenException('无权操作')
    return this.prisma.post.delete({ where: { id } })
  }

  async review(id: string, status: 'APPROVED' | 'REJECTED') {
    return this.prisma.post.update({ where: { id }, data: { status } })
  }

  async getCategories() {
    return this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
  }

  async createCategory(name: string, description?: string) {
    return this.prisma.category.create({ data: { name, description } })
  }

  async deleteCategory(id: string) {
    return this.prisma.category.delete({ where: { id } })
  }

  async getMyPosts(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize
    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: userId },
        skip,
        take: pageSize,
        include: { category: true, _count: { select: { comments: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where: { authorId: userId } }),
    ])
    return {
      data: data.map((p) => ({ ...p, commentCount: p._count.comments, _count: undefined })),
      total,
      page,
      pageSize,
    }
  }
}
