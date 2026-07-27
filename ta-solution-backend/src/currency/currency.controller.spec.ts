import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CurrencyController } from './currency.controller';
import { CurrencyService, ConversionResponse } from './currency.service';

describe('CurrencyController', () => {
  let controller: CurrencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
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

    controller = module.get<CurrencyController>(CurrencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return currencies from endpoint', async () => {
    const res = await controller.getCurrencies();
    expect(res.data).toHaveProperty('USD');
  });

  it('should convert currency via endpoint', async () => {
    const res: ConversionResponse = await controller.convertCurrency(
      '50',
      'USD',
      'EUR',
    );
    expect(res.amount).toBe(50);
    expect(res.result).toBeGreaterThan(0);
  });

  it('should throw BadRequestException if amount is invalid', async () => {
    await expect(
      controller.convertCurrency('invalid', 'USD', 'EUR'),
    ).rejects.toThrow();
  });
});
