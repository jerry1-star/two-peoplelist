import { IsString, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nickname?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string
}
