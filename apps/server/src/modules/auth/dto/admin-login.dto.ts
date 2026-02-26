import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AdminLoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  username: string

  @ApiProperty({ example: '123123' })
  @IsString()
  @MinLength(6, { message: '密码至少6位' })
  password: string
}
