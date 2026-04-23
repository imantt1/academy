import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ example: 'Introducción al RTP' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Contenido de la lección en markdown o HTML...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'https://stream.mux.com/xyz.m3u8' })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  moduleId: number;
}
