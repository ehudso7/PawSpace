import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { ServiceType, AvailabilityFilter } from '../../types/booking';

interface FilterChipsProps {
  selectedServiceType: ServiceType;
  selectedAvailability: AvailabilityFilter;
  onServiceTypeChange: (type: ServiceType) => void;
  onAvailabilityChange: (availability: AvailabilityFilter) => void;
}

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'walking', label: 'Walking' },
  { value: 'vet_care', label: 'Vet Care' },
  { value: 'training', label: 'Training' },
];

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
  { value: 'anytime', label: 'Anytime' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
];

export function FilterChips({
  selectedServiceType,
  selectedAvailability,
  onServiceTypeChange,
  onAvailabilityChange,
}: FilterChipsProps) {
  return (
    <View style={styles.container}>
      {/* Service Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipRowContent}
      >
        {SERVICE_TYPES.map((type) => (
          <Chip
            key={type.value}
            selected={selectedServiceType === type.value}
            onPress={() => onServiceTypeChange(type.value)}
            style={[
              styles.chip,
              selectedServiceType === type.value && styles.selectedChip,
            ]}
            textStyle={[
              styles.chipText,
              selectedServiceType === type.value && styles.selectedChipText,
            ]}
          >
            {type.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Availability Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipRowContent}
      >
        {AVAILABILITY_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            selected={selectedAvailability === option.value}
            onPress={() => onAvailabilityChange(option.value)}
            style={[
              styles.chip,
              selectedAvailability === option.value && styles.selectedChip,
            ]}
            textStyle={[
              styles.chipText,
              selectedAvailability === option.value && styles.selectedChipText,
            ]}
          >
            {option.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  chipRow: {
    marginBottom: 8,
  },
  chipRowContent: {
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});