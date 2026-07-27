import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CurrencyService, ConversionResponse } from './currency.service';

@ApiTags('currency')
@Controller('api/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('currencies')
  @ApiOperation({ summary: 'Get supported currencies metadata' })
  @ApiResponse({
    status: 200,
    description: 'Supported currencies map and fallback indicator.',
  })
  async getCurrencies() {
    return await this.currencyService.getCurrencies();
  }

  @Get('rates')
  @ApiOperation({ summary: 'Get exchange rates for a base currency' })
  @ApiQuery({ name: 'base_currency', required: false, example: 'USD' })
  @ApiQuery({ name: 'date', required: false, example: '2023-01-01' })
  @ApiResponse({
    status: 200,
    description: 'Map of exchange rates relative to base currency.',
  })
  async getRates(
    @Query('base_currency') baseCurrency?: string,
    @Query('date') date?: string,
  ) {
    return await this.currencyService.getRates(baseCurrency || 'USD', date);
  }

  @Get('convert')
  @ApiOperation({
    summary: 'Convert amount between two currencies (Live or Historical)',
  })
  @ApiQuery({ name: 'amount', required: true, example: '100' })
  @ApiQuery({ name: 'from', required: true, example: 'USD' })
  @ApiQuery({ name: 'to', required: true, example: 'EUR' })
  @ApiQuery({ name: 'date', required: false, example: '2023-01-01' })
  @ApiResponse({ status: 200, description: 'Conversion result details.' })
  async convertCurrency(
    @Query('amount') amountStr: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date?: string,
  ): Promise<ConversionResponse> {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a valid positive number');
    }
    if (!from || !to) {
      throw new BadRequestException(
        'From and To currency parameters are required',
      );
    }

    return await this.currencyService.convertCurrency(amount, from, to, date);
  }

  @Get('historical')
  @ApiOperation({ summary: 'Get historical exchange rates for a given date' })
  @ApiQuery({ name: 'date', required: true, example: '2023-01-01' })
  @ApiQuery({ name: 'base_currency', required: false, example: 'USD' })
  @ApiResponse({ status: 200, description: 'Historical exchange rates map.' })
  async getHistoricalRates(
    @Query('date') date: string,
    @Query('base_currency') baseCurrency?: string,
  ) {
    if (!date) {
      throw new BadRequestException(
        'Date parameter (YYYY-MM-DD) is required for historical rates',
      );
    }
    return await this.currencyService.getRates(baseCurrency || 'USD', date);
  }
}
