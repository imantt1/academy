import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ example: 'Anatomía del RTP' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Descripción del módulo...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiPropertyOptional({ example: 70, description: 'Puntaje mínimo para aprobar (0-100)' })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  passingScore?: number;

  @ApiPropertyOptional({ example: 1, description: 'Grupo de quiz compartido entre módulos' })
  @IsInt()
  @IsOptional()
  sharedQuizGroup?: number;
}
