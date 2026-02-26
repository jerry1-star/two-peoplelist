import { IsString, IsOptional, IsBoolean, IsInt, Min, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  title: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  coverUrl?: string

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
