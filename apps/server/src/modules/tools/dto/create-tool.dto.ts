import { IsString, IsOptional, IsBoolean, IsInt, IsArray, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateToolDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  iconUrl?: string

  @ApiProperty()
  @IsString()
  link: string

  @ApiProperty()
  @IsString()
  categoryName: string

  @ApiProperty({ type: [String], default: [] })
  @IsOptional()
  @IsArray()
  tags?: string[]

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number
}
