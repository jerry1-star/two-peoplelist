import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateBannerDto } from './dto/create-banner.dto'

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async findActive(position?: 'HOME_TOP' | 'HOME_MIDDLE') {
    const now = new Date()
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        ...(position ? { position } : {}),
        OR: [
          { startAt: null },
          { startAt: { lte: now } },
        ],
        AND: [
          { OR: [{ endAt: null }, { endAt: { gte: now } }] },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    })
  }

  async findAll() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })
  }

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        ...dto,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      },
    })
  }

  async update(id: string, dto: Partial<CreateBannerDto>) {
    return this.prisma.banner.update({
      where: { id },
      data: {
        ...dto,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      },
    })
  }

  async remove(id: string) {
    return this.prisma.banner.delete({ where: { id } })
  }
}
