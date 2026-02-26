import { IsString, IsOptional, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ example: 'AI 工具讨论' })
  @IsString()
  name: string

  @ApiProperty({ example: '讨论各种 AI 工具的使用技巧', required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  sortOrder?: number
}
