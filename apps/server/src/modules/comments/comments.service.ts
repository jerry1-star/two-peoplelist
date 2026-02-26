import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

const authorSelect = { id: true, nickname: true, avatar: true }

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByPost(postId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize
    const [data, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId },
        skip,
        take: pageSize,
        include: { author: { select: authorSelect } },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.comment.count({ where: { postId } }),
    ])
    return { data, total, page, pageSize }
  }

  async create(postId: string, authorId: string, content: string) {
    return this.prisma.comment.create({
      data: { postId, authorId, content },
      include: { author: { select: authorSelect } },
    })
  }

  async remove(id: string, userId: string) {
    return this.prisma.comment.deleteMany({ where: { id, authorId: userId } })
  }
}
