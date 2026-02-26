import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCourseDto } from './dto/create-course.dto'

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(onlyPublished = true) {
    return this.prisma.course.findMany({
      where: onlyPublished ? { isPublished: true } : {},
      orderBy: { sortOrder: 'asc' },
    })
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } })
    if (!course) throw new NotFoundException('课程不存在')
    return course
  }

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({ data: dto })
  }

  async update(id: string, dto: Partial<CreateCourseDto>) {
    return this.prisma.course.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    return this.prisma.course.delete({ where: { id } })
  }
}
