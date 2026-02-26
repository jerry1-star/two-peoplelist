import { IsString, Matches, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: '13800138000' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: '验证码为6位' })
  code: string
}
