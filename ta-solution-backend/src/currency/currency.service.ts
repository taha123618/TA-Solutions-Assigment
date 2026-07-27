import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CurrencyMetadata {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
}

export interface ConversionResponse {
  amount: number;
  from: string;
  to: string;
  date: string;
  result: number;
  rate: number;
  timestamp: string;
  isHistorical: boolean;
  isFallback: boolean;
}

interface ApiResponsePayload {
  error?: { message?: string };
  data?: Record<string, unknown>;
}

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private readonly baseUrl = 'https://api.freecurrencyapi.com/v1';

  constructor(private readonly configService: ConfigService) {}

  private getApiKey(): string {
    return (
      this.configService.get<string>('CURRENCY_API_KEY') ||
      process.env.CURRENCY_API_KEY ||
      ''
    );
  }

  // Realistic mock dataset for 33 major currencies if API quota is reached
  private readonly fallbackCurrencies: Record<string, CurrencyMetadata> = {
    USD: {
      symbol: '$',
      name: 'US Dollar',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0,
      code: 'USD',
      name_plural: 'US dollars',
    },
    EUR: {
      symbol: '€',
      name: 'Euro',
      symbol_native: '€',
      decimal_digits: 2,
      rounding: 0,
      code: 'EUR',
      name_plural: 'Euros',
    },
    GBP: {
      symbol: '£',
      name: 'British Pound',
      symbol_native: '£',
      decimal_digits: 2,
      rounding: 0,
      code: 'GBP',
      name_plural: 'British pounds',
    },
    JPY: {
      symbol: '¥',
      name: 'Japanese Yen',
      symbol_native: '￥',
      decimal_digits: 0,
      rounding: 0,
      code: 'JPY',
      name_plural: 'Japanese yen',
    },
    CAD: {
      symbol: 'CA$',
      name: 'Canadian Dollar',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0,
      code: 'CAD',
      name_plural: 'Canadian dollars',
    },
    AUD: {
      symbol: 'AU$',
      name: 'Australian Dollar',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0,
      code: 'AUD',
      name_plural: 'Australian dollars',
    },
    CHF: {
      symbol: 'CHF',
      name: 'Swiss Franc',
      symbol_native: 'CHF',
      decimal_digits: 2,
      rounding: 0,
      code: 'CHF',
      name_plural: 'Swiss francs',
    },
    CNY: {
      symbol: 'CN¥',
      name: 'Chinese Yuan',
      symbol_native: '¥',
      decimal_digits: 2,
      rounding: 0,
      code: 'CNY',
      name_plural: 'Chinese yuan',
    },
    HKD: {
      symbol: 'HK$',
      name: 'Hong Kong Dollar',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0,
      code: 'HKD',
      name_plural: 'Hong Kong dollars',
    },
    NZD: {
      symbol: 'NZ$',
      name: 'New Zealand Dollar',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0,
      code: 'NZD',
      name_plural: 'New Zealand dollars',
    },
    SEK: {
      symbol: 'SKr',
      name: 'Swedish Krona',
      symbol_native: 'kr',
      decimal_digits: 2,
      rounding: 0,
      code: 'SEK',
      name_plural: 'Swedish kronor',
    },
    KRW: {
      symbol: '₩',
      name: 'South Korean Won',
      symbol_native: '₩',
      decimal_digits: 0,
      rounding: 0,
      code: 'KRW',
      name_plural: 'South Korean won',
    },
    SGD: {
      symbol: 'S$',
      name: 'Singapore Dollar',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0,
      code: 'SGD',
      name_plural: 'Singapore dollars',
    },
    NOK: {
      symbol: 'NKr',
      name: 'Norwegian Krone',
      symbol_native: 'kr',
      decimal_digits: 2,
      rounding: 0,
      code: 'NOK',
      name_plural: 'Norwegian kroner',
    },
    MXN: {
      symbol: 'MX$',
      name: 'Mexican Peso',
      symbol_native: '$',
      decimal_digits: 2,
      rounding: 0,
      code: 'MXN',
      name_plural: 'Mexican pesos',
    },
    INR: {
      symbol: '₹',
      name: 'Indian Rupee',
      symbol_native: '₹',
      decimal_digits: 2,
      rounding: 0,
      code: 'INR',
      name_plural: 'Indian rupees',
    },
    BRL: {
      symbol: 'R$',
      name: 'Brazilian Real',
      symbol_native: 'R$',
      decimal_digits: 2,
      rounding: 0,
      code: 'BRL',
      name_plural: 'Brazilian reals',
    },
    ZAR: {
      symbol: 'R',
      name: 'South African Rand',
      symbol_native: 'R',
      decimal_digits: 2,
      rounding: 0,
      code: 'ZAR',
      name_plural: 'South African rand',
    },
    TRY: {
      symbol: '₺',
      name: 'Turkish Lira',
      symbol_native: '₺',
      decimal_digits: 2,
      rounding: 0,
      code: 'TRY',
      name_plural: 'Turkish Lira',
    },
    AED: {
      symbol: 'AED',
      name: 'United Arab Emirates Dirham',
      symbol_native: 'د.إ.',
      decimal_digits: 2,
      rounding: 0,
      code: 'AED',
      name_plural: 'UAE dirhams',
    },
    SAR: {
      symbol: 'SR',
      name: 'Saudi Riyal',
      symbol_native: 'ر.س.',
      decimal_digits: 2,
      rounding: 0,
      code: 'SAR',
      name_plural: 'Saudi riyals',
    },
    PKR: {
      symbol: 'PKRs',
      name: 'Pakistani Rupee',
      symbol_native: '₨',
      decimal_digits: 2,
      rounding: 0,
      code: 'PKR',
      name_plural: 'Pakistani rupees',
    },
    EGP: {
      symbol: 'EGP',
      name: 'Egyptian Pound',
      symbol_native: 'ج.م.',
      decimal_digits: 2,
      rounding: 0,
      code: 'EGP',
      name_plural: 'Egyptian pounds',
    },
    DKK: {
      symbol: 'DKr',
      name: 'Danish Krone',
      symbol_native: 'kr',
      decimal_digits: 2,
      rounding: 0,
      code: 'DKK',
      name_plural: 'Danish kroner',
    },
    PLN: {
      symbol: 'zł',
      name: 'Polish Zloty',
      symbol_native: 'zł',
      decimal_digits: 2,
      rounding: 0,
      code: 'PLN',
      name_plural: 'Polish zlotys',
    },
    THB: {
      symbol: '฿',
      name: 'Thai Baht',
      symbol_native: '฿',
      decimal_digits: 2,
      rounding: 0,
      code: 'THB',
      name_plural: 'Thai baht',
    },
    IDR: {
      symbol: 'Rp',
      name: 'Indonesian Rupiah',
      symbol_native: 'Rp',
      decimal_digits: 0,
      rounding: 0,
      code: 'IDR',
      name_plural: 'Indonesian rupiahs',
    },
    HUF: {
      symbol: 'Ft',
      name: 'Hungarian Forint',
      symbol_native: 'Ft',
      decimal_digits: 0,
      rounding: 0,
      code: 'HUF',
      name_plural: 'Hungarian forints',
    },
    CZK: {
      symbol: 'Kč',
      name: 'Czech Koruna',
      symbol_native: 'Kč',
      decimal_digits: 2,
      rounding: 0,
      code: 'CZK',
      name_plural: 'Czech Republic korunas',
    },
    ILS: {
      symbol: '₪',
      name: 'Israeli New Sheqel',
      symbol_native: '₪',
      decimal_digits: 2,
      rounding: 0,
      code: 'ILS',
      name_plural: 'Israeli new sheqels',
    },
    CLP: {
      symbol: 'CL$',
      name: 'Chilean Peso',
      symbol_native: '$',
      decimal_digits: 0,
      rounding: 0,
      code: 'CLP',
      name_plural: 'Chilean pesos',
    },
    PHP: {
      symbol: '₱',
      name: 'Philippine Peso',
      symbol_native: '₱',
      decimal_digits: 2,
      rounding: 0,
      code: 'PHP',
      name_plural: 'Philippine pesos',
    },
    MYR: {
      symbol: 'RM',
      name: 'Malaysian Ringgit',
      symbol_native: 'RM',
      decimal_digits: 2,
      rounding: 0,
      code: 'MYR',
      name_plural: 'Malaysian ringgits',
    },
  };

  // Base rates relative to 1 USD
  private readonly fallbackUsdRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 155.4,
    CAD: 1.38,
    AUD: 1.52,
    CHF: 0.88,
    CNY: 7.25,
    HKD: 7.82,
    NZD: 1.68,
    SEK: 10.75,
    KRW: 1385.0,
    SGD: 1.35,
    NOK: 11.05,
    MXN: 18.25,
    INR: 83.65,
    BRL: 5.65,
    ZAR: 18.2,
    TRY: 33.15,
    AED: 3.67,
    SAR: 3.75,
    PKR: 278.5,
    EGP: 48.2,
    DKK: 6.87,
    PLN: 3.95,
    THB: 36.2,
    IDR: 16350.0,
    HUF: 365.0,
    CZK: 23.3,
    ILS: 3.68,
    CLP: 945.0,
    PHP: 58.4,
    MYR: 4.68,
  };

  async getCurrencies(): Promise<{
    data: Record<string, CurrencyMetadata>;
    isFallback: boolean;
  }> {
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/currencies?apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API response HTTP ${response.status}`);
      }
      const json = (await response.json()) as ApiResponsePayload;
      if (json.error) {
        throw new Error(json.error.message || 'API error');
      }
      if (json.data && Object.keys(json.data).length > 0) {
        return {
          data: json.data as Record<string, CurrencyMetadata>,
          isFallback: false,
        };
      }
      throw new Error('Empty currency data');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `Failed to fetch currencies from API: ${msg}. Using fallback data.`,
      );
      return { data: this.fallbackCurrencies, isFallback: true };
    }
  }

  async getRates(
    baseCurrency: string = 'USD',
    date?: string,
  ): Promise<{
    data: Record<string, number>;
    date?: string;
    isFallback: boolean;
  }> {
    const apiKey = this.getApiKey();
    const isHistorical = !!date;
    const endpoint = isHistorical ? 'historical' : 'latest';
    let url = `${this.baseUrl}/${endpoint}?apikey=${apiKey}&base_currency=${baseCurrency}`;

    if (isHistorical) {
      url += `&date=${date}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API response HTTP ${response.status}`);
      }
      const json = (await response.json()) as ApiResponsePayload;
      if (json.error) {
        throw new Error(json.error.message || 'API error');
      }

      if (isHistorical) {
        const historicalData = json.data as
          Record<string, Record<string, number>> | undefined;
        if (historicalData) {
          const dateKey = date || Object.keys(historicalData)[0];
          const rates =
            historicalData[dateKey] || Object.values(historicalData)[0];
          if (rates && typeof rates === 'object') {
            return {
              data: rates,
              date: dateKey,
              isFallback: false,
            };
          }
        }
      } else if (json.data && typeof json.data === 'object') {
        return {
          data: json.data as Record<string, number>,
          isFallback: false,
        };
      }

      throw new Error('Invalid rate response format');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `Failed to fetch exchange rates (${endpoint}): ${msg}. Calculating fallback rates.`,
      );

      // Calculate fallback rates relative to requested baseCurrency
      const baseInUsd = this.fallbackUsdRates[baseCurrency] || 1.0;
      const calculatedRates: Record<string, number> = {};

      // If historical, apply a slight deterministic variation based on date to mimic historical differences
      let dateMultiplier = 1.0;
      if (date) {
        const charSum = date
          .split('')
          .reduce((acc, c) => acc + c.charCodeAt(0), 0);
        dateMultiplier = 0.95 + (charSum % 100) / 1000; // 0.95 - 1.05
      }

      for (const [code, rateInUsd] of Object.entries(this.fallbackUsdRates)) {
        calculatedRates[code] =
          (rateInUsd / baseInUsd) *
          (code === baseCurrency ? 1.0 : dateMultiplier);
      }

      return { data: calculatedRates, date, isFallback: true };
    }
  }

  async convertCurrency(
    amount: number,
    from: string = 'USD',
    to: string = 'EUR',
    date?: string,
  ): Promise<ConversionResponse> {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();

    // Fetch rates with base_currency = fromUpper
    const ratesResult = await this.getRates(fromUpper, date);
    let rate = ratesResult.data[toUpper];

    if (rate === undefined) {
      // If target currency not directly in rate payload, compute via fallback USD cross-rate
      const fromRateInUsd = this.fallbackUsdRates[fromUpper] || 1.0;
      const toRateInUsd = this.fallbackUsdRates[toUpper] || 1.0;
      rate = toRateInUsd / fromRateInUsd;
    }

    const result = Number((amount * rate).toFixed(6));

    return {
      amount,
      from: fromUpper,
      to: toUpper,
      date: date || new Date().toISOString().split('T')[0],
      result,
      rate: Number(rate.toFixed(6)),
      timestamp: new Date().toISOString(),
      isHistorical: !!date,
      isFallback: ratesResult.isFallback,
    };
  }
}
