import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CurrencyService, ConversionResponse } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'CURRENCY_API_KEY') {
                return process.env.CURRENCY_API_KEY || '';
              }
              return null;
            },
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return currencies list', async () => {
    const res = await service.getCurrencies();
    expect(res).toBeDefined();
    expect(res.data).toHaveProperty('USD');
    expect(res.data).toHaveProperty('EUR');
  });

  it('should convert currency correctly', async () => {
    const res: ConversionResponse = await service.convertCurrency(
      100,
      'USD',
      'EUR',
    );
    expect(res.amount).toBe(100);
    expect(res.from).toBe('USD');
    expect(res.to).toBe('EUR');
    expect(res.result).toBeGreaterThan(0);
    expect(res.rate).toBeGreaterThan(0);
  });

  it('should handle historical currency conversion', async () => {
    const res: ConversionResponse = await service.convertCurrency(
      200,
      'EUR',
      'GBP',
      '2023-01-01',
    );
    expect(res.amount).toBe(200);
    expect(res.isHistorical).toBe(true);
    expect(res.date).toBe('2023-01-01');
    expect(res.result).toBeGreaterThan(0);
  });
});
