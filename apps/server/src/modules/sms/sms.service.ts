import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '../redis/redis.decorator'
import type Redis from 'ioredis'

const SMS_TTL = 300 // 5 minutes

@Injectable()
export class SmsService {
  constructor(
    private config: ConfigService,
    @InjectRedis() private redis: Redis,
  ) {}

  async sendCode(phone: string): Promise<void> {
    const isMock = this.config.get<string>('SMS_MOCK_ENABLED') === 'true'
    const code = isMock
      ? (this.config.get<string>('SMS_MOCK_CODE') ?? '123456')
      : Math.floor(100000 + Math.random() * 900000).toString()

    await this.redis.set(`sms:${phone}`, code, 'EX', SMS_TTL)

    if (isMock) {
      console.log(`[SMS Mock] Phone: ${phone}, Code: ${code}`)
    }
  }

  async verifyCode(phone: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(`sms:${phone}`)
    if (!stored || stored !== code) return false
    await this.redis.del(`sms:${phone}`)
    return true
  }
}
