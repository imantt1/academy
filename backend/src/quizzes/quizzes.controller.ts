import {
  Controller, Get, Post, Param, Body,
  ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuizzesService } from './quizzes.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@ApiTags('Quizzes')
@Controller('quizzes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('module/:moduleId')
  @ApiOperation({ summary: 'Obtener quiz de un módulo (sin respuestas correctas)' })
  findByModule(@Param('moduleId', ParseIntPipe) moduleId: number) {
    return this.quizzesService.findByModule(moduleId);
  }

  @Post('module/:moduleId/submit')
  @ApiOperation({ summary: 'Enviar respuestas del quiz y obtener resultado' })
  submit(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Request() req,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizzesService.submit(moduleId, req.user.sub, dto);
  }

  @Get('my-progress')
  @ApiOperation({ summary: 'Obtener mi progreso en todos los módulos' })
  myProgress(@Request() req) {
    return this.quizzesService.getUserProgress(req.user.sub);
  }
}
