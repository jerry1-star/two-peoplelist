import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalUsers,
      activeUsers,
      totalPosts,
      pendingPosts,
      totalCourses,
      totalTools,
      todayNewUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.post.count(),
      this.prisma.post.count({ where: { status: 'PENDING' } }),
      this.prisma.course.count({ where: { isPublished: true } }),
      this.prisma.tool.count({ where: { isPublished: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
    ])

    return {
      totalUsers,
      activeUsers,
      totalPosts,
      pendingPosts,
      totalCourses,
      totalTools,
      todayNewUsers,
    }
  }
}
