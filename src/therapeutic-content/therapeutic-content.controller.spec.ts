import { Test, TestingModule } from '@nestjs/testing';
import { TherapeuticContentController } from './therapeutic-content.controller';
import { TherapeuticContentService } from './therapeutic-content.service';

describe('TherapeuticContentController', () => {
  let controller: TherapeuticContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TherapeuticContentController],
      providers: [TherapeuticContentService],
    }).compile();

    controller = module.get<TherapeuticContentController>(TherapeuticContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
