import { Module } from '@nestjs/common';
import { TherapeuticContentService } from './therapeutic-content.service';
import { TherapeuticContentController } from './therapeutic-content.controller';

@Module({
  controllers: [TherapeuticContentController],
  providers: [TherapeuticContentService],
})
export class TherapeuticContentModule {}
