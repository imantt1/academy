import {
  Controller, Get, Post, Param, Res,
  ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CertificatesService } from './certificates.service';

@ApiTags('Certificados')
@Controller('certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('mine')
  @ApiOperation({ summary: 'Listar mis certificados emitidos' })
  getMyCertificates(@Request() req) {
    return this.certificatesService.getMyCertificates(req.user.sub);
  }

  @Post('module/:moduleId/generate')
  @ApiOperation({ summary: 'Generar certificado PDF para un módulo completado' })
  async generate(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @Request() req,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.certificatesService.generate(req.user.sub, moduleId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificado-modulo-${moduleId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
