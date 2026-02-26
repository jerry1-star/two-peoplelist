import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateCaseDto } from './dto/create-case.dto'

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize
    const where = { isPublished: true }
    const [data, total] = await Promise.all([
      this.prisma.case.findMany({ where, skip, take: pageSize, orderBy: { sortOrder: 'asc' } }),
      this.prisma.case.count({ where }),
    ])
    return { data, total, page, pageSize }
  }

  async findAllAdmin(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize
    const [data, total] = await Promise.all([
      this.prisma.case.findMany({ skip, take: pageSize, orderBy: { sortOrder: 'asc' } }),
      this.prisma.case.count(),
    ])
    return { data, total, page, pageSize }
  }

  async findOne(id: string) {
    const item = await this.prisma.case.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('案例不存在')
    return item
  }

  async create(dto: CreateCaseDto) {
    return this.prisma.case.create({ data: dto })
  }

  async update(id: string, dto: Partial<CreateCaseDto>) {
    return this.prisma.case.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    return this.prisma.case.delete({ where: { id } })
  }
}
