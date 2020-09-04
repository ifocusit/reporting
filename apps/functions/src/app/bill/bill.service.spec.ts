import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../settings/settings.service';
import { TimeService } from '../time/time.service';
import { BillService } from './bill.service';

describe('BillService', () => {
  let service: BillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillService, { provide: TimeService, useValue: jest.fn() }, { provide: SettingsService, useValue: jest.fn() }]
    }).compile();

    service = module.get<BillService>(BillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
