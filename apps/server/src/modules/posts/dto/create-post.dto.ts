import { IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string

  @ApiProperty()
  @IsString()
  @MinLength(10)
  content: string

  @ApiProperty()
  @IsString()
  categoryId: string
}
