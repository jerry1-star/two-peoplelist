import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCaseDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  summary: string

  @ApiProperty()
  @IsString()
  content: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverUrl?: string

  @ApiProperty()
  @IsString()
  authorName: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  revenue?: string

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}
