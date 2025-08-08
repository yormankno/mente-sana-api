import { Test, TestingModule } from '@nestjs/testing';
import { TherapeuticContentService } from './therapeutic-content.service';

describe('TherapeuticContentService', () => {
  let service: TherapeuticContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TherapeuticContentService],
    }).compile();

    service = module.get<TherapeuticContentService>(TherapeuticContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
