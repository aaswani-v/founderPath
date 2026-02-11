import { create } from 'zustand';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // relative to USD
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
};

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatAmount: (usdAmount: number) => string;
  formatRange: (lowUsd: number, highUsd: number) => string;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: 'INR',

  setCurrency: (currency) => set({ currency }),

  formatAmount: (usdAmount: number) => {
    const info = CURRENCIES[get().currency];
    const converted = Math.round(usdAmount * info.rate);
    if (converted === 0) return `${info.symbol}0`;
    if (converted >= 100000) return `${info.symbol}${(converted / 1000).toFixed(0)}K`;
    if (converted >= 10000) return `${info.symbol}${(converted / 1000).toFixed(1)}K`;
    return `${info.symbol}${converted.toLocaleString()}`;
  },

  formatRange: (lowUsd: number, highUsd: number) => {
    const { formatAmount } = get();
    if (lowUsd === 0 && highUsd === 0) return formatAmount(0);
    if (lowUsd === 0) return `${formatAmount(0)}–${formatAmount(highUsd)}`;
    return `${formatAmount(lowUsd)}–${formatAmount(highUsd)}`;
  },
}));
