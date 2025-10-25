import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 200 },
  { label: '$0 - $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: 200 },
];

export function PriceRangeSlider({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceRangeSliderProps) {
  const handleRangeSelect = (min: number, max: number) => {
    onMinPriceChange(min);
    onMaxPriceChange(max);
  };

  const isSelected = (min: number, max: number) => {
    return minPrice === min && maxPrice === max;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Range</Text>
      <View style={styles.buttonContainer}>
        {PRICE_RANGES.map((range) => (
          <Button
            key={range.label}
            mode={isSelected(range.min, range.max) ? 'contained' : 'outlined'}
            onPress={() => handleRangeSelect(range.min, range.max)}
            style={[
              styles.rangeButton,
              isSelected(range.min, range.max) && styles.selectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              isSelected(range.min, range.max) && styles.selectedButtonLabel,
            ]}
          >
            {range.label}
          </Button>
        ))}
      </View>
      <Text style={styles.currentRange}>
        Current: ${minPrice} - ${maxPrice}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rangeButton: {
    marginBottom: 8,
    borderColor: '#E0E0E0',
  },
  selectedButton: {
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    fontSize: 12,
    color: '#666',
  },
  selectedButtonLabel: {
    color: '#FFFFFF',
  },
  currentRange: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});