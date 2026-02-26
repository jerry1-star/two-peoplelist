import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'
import { SmsService } from '../sms/sms.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private smsService: SmsService,
  ) {}

  async sendCode(phone: string): Promise<void> {
    await this.smsService.sendCode(phone)
  }

  async login(phone: string, code: string) {
    const valid = await this.smsService.verifyCode(phone, code)
    if (!valid) throw new UnauthorizedException('验证码错误或已过期')

    let user = await this.prisma.user.findUnique({ where: { phone } })
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone, nickname: `用户${phone.slice(-4)}` },
      })
      const memberRole = await this.prisma.role.findUnique({ where: { name: 'member' } })
      if (memberRole) {
        await this.prisma.userRole.create({ data: { userId: user.id, roleId: memberRole.id } })
      }
    }

    return this.generateTokens(user.id)
  }

  async adminLogin(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } })
    if (!user || !user.passwordHash) throw new UnauthorizedException('用户名或密码错误')
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('用户名或密码错误')
    if (user.status === 'BANNED') throw new UnauthorizedException('账号已被禁用')
    return this.generateTokens(user.id)
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token 无效或已过期')
    }

    await this.prisma.refreshToken.delete({ where: { token: refreshToken } })
    return this.generateTokens(stored.userId)
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
  }

  private async generateTokens(userId: string) {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET')
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET')

    const accessExpires = this.config.get<string>('JWT_ACCESS_EXPIRES', '15m') as `${number}${'s'|'m'|'h'|'d'}`
    const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES', '7d') as `${number}${'s'|'m'|'h'|'d'}`

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId }, {
        secret: accessSecret,
        expiresIn: accessExpires,
      }),
      this.jwtService.signAsync({ sub: userId }, {
        secret: refreshSecret,
        expiresIn: refreshExpires,
      }),
    ])

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId, expiresAt },
    })

    return { accessToken, refreshToken }
  }
}
