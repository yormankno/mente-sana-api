import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './therapeutic-content.service';
import { ContentController } from './therapeutic-content.controller';
import { TherapeuticContent } from './entities/therapeutic-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TherapeuticContent])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}