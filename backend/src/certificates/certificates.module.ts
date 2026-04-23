import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgress } from '../entities/user-progress.entity';
import { Module as ModuleEntity } from '../entities/module.entity';
import { User } from '../entities/user.entity';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress, ModuleEntity, User])],
  providers: [CertificatesService],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
