import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCurrencyStore, CURRENCIES, CurrencyCode } from '../store/currencyStore';
import { FontSize, FontWeight, useThemeColors } from '../theme';

interface ConvertibleCostProps {
  costLow: number;
  costHigh: number;
  style?: any;
}

const CURRENCY_ORDER: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP'];

/**
 * Tappable cost label that displays the amount in the current currency.
 * Tap to cycle through INR → USD → EUR → GBP.
 */
export const ConvertibleCost: React.FC<ConvertibleCostProps> = ({ costLow, costHigh, style }) => {
  const { currency, setCurrency, formatAmount, formatRange } = useCurrencyStore();
  const colors = useThemeColors();

  const handleTap = () => {
    const idx = CURRENCY_ORDER.indexOf(currency);
    const next = CURRENCY_ORDER[(idx + 1) % CURRENCY_ORDER.length];
    setCurrency(next);
  };

  const displayText =
    costLow === 0 && costHigh === 0
      ? `${CURRENCIES[currency].symbol}0`
      : costLow === costHigh
        ? formatAmount(costLow)
        : formatRange(costLow, costHigh);

  return (
    <TouchableOpacity onPress={handleTap} activeOpacity={0.6}>
      <Text style={[s.cost, { color: colors.accent }, style]}>
        {displayText}
      </Text>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  cost: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
  },
});
