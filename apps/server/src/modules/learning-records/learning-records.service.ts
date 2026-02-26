import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class LearningRecordsService {
  constructor(private prisma: PrismaService) {}

  async getMyRecords(userId: string) {
    return this.prisma.learningRecord.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async upsert(userId: string, courseId: string, progress: number) {
    const completedAt = progress >= 100 ? new Date() : undefined
    return this.prisma.learningRecord.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { progress, ...(completedAt ? { completedAt } : {}) },
      create: { userId, courseId, progress, ...(completedAt ? { completedAt } : {}) },
    })
  }
}
