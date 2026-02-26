import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  imageUrl: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  link?: string

  @ApiProperty({ enum: ['HOME_TOP', 'HOME_MIDDLE'], default: 'HOME_TOP' })
  @IsOptional()
  @IsEnum(['HOME_TOP', 'HOME_MIDDLE'])
  position?: 'HOME_TOP' | 'HOME_MIDDLE'

  @ApiProperty({ required: false })
  @IsOptional()
  startAt?: string

  @ApiProperty({ required: false })
  @IsOptional()
  endAt?: string

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number
}
