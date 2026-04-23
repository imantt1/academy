import {
  Controller, Get, Post, Put, Delete,
  Param, Body, ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';

@ApiTags('Módulos')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los módulos con progreso del usuario' })
  findAll(@Request() req) {
    return this.modulesService.findAll(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un módulo específico con lecciones y quiz' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.modulesService.findOne(id, req.user.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Crear un módulo' })
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Actualizar un módulo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateModuleDto>) {
    return this.modulesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Eliminar un módulo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.remove(id);
  }
}
