import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { UserProgress } from '../entities/user-progress.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
import { User } from '../entities/user.entity';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(UserProgress)
    private progressRepo: Repository<UserProgress>,
    @InjectRepository(ModuleEntity)
    private modulesRepo: Repository<ModuleEntity>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async generate(userId: string, moduleId: number): Promise<Buffer> {
    // Verify progress
    const progress = await this.progressRepo.findOne({ where: { userId, moduleId } });
    if (!progress) throw new NotFoundException('Progreso no encontrado');
    if (!progress.completed) {
      throw new ForbiddenException('Debes completar el módulo antes de obtener el certificado');
    }

    const module = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!module) throw new NotFoundException('Módulo no encontrado');

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Mark certificate as issued
    progress.certificateIssued = true;
    await this.progressRepo.save(progress);

    // Generate unique verification code
    const verificationCode = crypto
      .createHash('sha256')
      .update(`${userId}-${moduleId}-${Date.now()}`)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();

    return this.buildPdf(user, module, progress, verificationCode);
  }

  async getMyCertificates(userId: string) {
    return this.progressRepo.find({
      where: { userId, certificateIssued: true },
    });
  }

  private async buildPdf(
    user: User,
    module: ModuleEntity,
    progress: UserProgress,
    code: string,
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Brand colors
    const navy = rgb(0.118, 0.176, 0.42);   // #1E2D6B
    const blue = rgb(0.482, 0.624, 0.831);  // #7B9FD4
    const gold = rgb(0.831, 0.682, 0.047);  // #D4AE0C
    const white = rgb(1, 1, 1);
    const lightGray = rgb(0.95, 0.95, 0.97);

    // Background
    page.drawRectangle({ x: 0, y: 0, width, height, color: white });

    // Navy header bar
    page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: navy });

    // Gold accent stripe
    page.drawRectangle({ x: 0, y: height - 116, width, height: 6, color: gold });

    // Footer bar
    page.drawRectangle({ x: 0, y: 0, width, height: 70, color: navy });
    page.drawRectangle({ x: 0, y: 70, width, height: 4, color: gold });

    // Side accent (left)
    page.drawRectangle({ x: 0, y: 70, width: 8, height: height - 186, color: blue });

    // Side accent (right)
    page.drawRectangle({ x: width - 8, y: 70, width: 8, height: height - 186, color: blue });

    // Light body background
    page.drawRectangle({ x: 8, y: 74, width: width - 16, height: height - 190, color: lightGray });

    // Header: Logo image (white card so the logo reads on dark background)
    try {
      const logoPath = path.join(__dirname, '../../src/assets/logo.png');
      const logoBytes = fs.readFileSync(logoPath);
      const logoImg = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImg.scale(1);
      const logoH = 70;
      const logoW = (logoDims.width / logoDims.height) * logoH;
      const logoPadX = 8, logoPadY = 6;
      // White pill behind the logo
      page.drawRectangle({
        x: 28, y: height - 100,
        width: logoW + logoPadX * 2, height: logoH + logoPadY * 2,
        color: white, borderRadius: 8,
      });
      page.drawImage(logoImg, {
        x: 28 + logoPadX, y: height - 100 + logoPadY,
        width: logoW, height: logoH,
      });
    } catch {
      // Fallback to text if image not found
      page.drawText('IMANTT ACADEMY', {
        x: 40, y: height - 68,
        size: 28, font: fontBold, color: white,
      });
      page.drawText('Transforming Infrastructure', {
        x: 40, y: height - 90,
        size: 12, font: fontItalic, color: blue,
      });
    }

    // Certificate title
    page.drawText('CERTIFICADO DE FINALIZACIÓN', {
      x: width / 2 - 200, y: height - 160,
      size: 22, font: fontBold, color: navy,
    });

    // Gold underline under title
    page.drawRectangle({
      x: width / 2 - 200, y: height - 168,
      width: 400, height: 2, color: gold,
    });

    // "Se certifica que"
    page.drawText('Se certifica que', {
      x: width / 2 - 70, y: height - 210,
      size: 14, font: fontRegular, color: rgb(0.3, 0.3, 0.3),
    });

    // Student name
    const fullName = `${user.firstName} ${user.lastName}`;
    const nameSize = 30;
    const nameWidth = fontBold.widthOfTextAtSize(fullName, nameSize);
    page.drawText(fullName, {
      x: (width - nameWidth) / 2, y: height - 255,
      size: nameSize, font: fontBold, color: navy,
    });

    // "ha completado satisfactoriamente"
    page.drawText('ha completado satisfactoriamente el módulo:', {
      x: width / 2 - 155, y: height - 290,
      size: 13, font: fontRegular, color: rgb(0.3, 0.3, 0.3),
    });

    // Module title
    const moduleTitle = module.title;
    const modSize = 18;
    const modWidth = fontBold.widthOfTextAtSize(moduleTitle, modSize);
    page.drawText(moduleTitle, {
      x: (width - modWidth) / 2, y: height - 320,
      size: modSize, font: fontBold, color: blue,
    });

    // Score
    page.drawText(`Puntuación obtenida: ${progress.score}%`, {
      x: width / 2 - 90, y: height - 355,
      size: 12, font: fontRegular, color: rgb(0.4, 0.4, 0.4),
    });

    // Date
    const dateStr = new Date().toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    page.drawText(`Fecha de emisión: ${dateStr}`, {
      x: width / 2 - 85, y: height - 375,
      size: 11, font: fontItalic, color: rgb(0.5, 0.5, 0.5),
    });

    // Separator line
    page.drawRectangle({
      x: 60, y: height - 395, width: width - 120, height: 1, color: blue,
    });

    // Signature area
    page.drawText('_______________________________', {
      x: 100, y: height - 430, size: 11, font: fontRegular, color: rgb(0.6, 0.6, 0.6),
    });
    page.drawText('Dire