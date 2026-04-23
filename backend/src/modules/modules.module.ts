import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from '../entities/module.entity';
import { UserProgress } from '../entities/user-progress.entity';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, UserProgress])],
  providers: [ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService],
})
export class ModulesModule {}
