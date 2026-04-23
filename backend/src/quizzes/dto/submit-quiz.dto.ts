import { IsArray, IsInt, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  questionId: number;

  @ApiProperty({ example: 2, description: 'Índice de la respuesta seleccionada (0-based)' })
  @IsInt()
  selectedAnswer: number;
}

export class SubmitQuizDto {
  @ApiProperty({ type: [AnswerDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
