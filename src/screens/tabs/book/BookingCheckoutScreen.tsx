import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookStackParamList } from '../../../types/navigation';

export type BookingCheckoutScreenProps = NativeStackScreenProps<
  BookStackParamList,
  'BookingCheckout'
>;

const BookingCheckoutScreen: React.FC<BookingCheckoutScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { serviceId, date } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Checkout</Text>
      <Text style={styles.meta}>Service ID: {serviceId}</Text>
      <Text style={styles.meta}>Date: {date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  meta: {
    marginTop: 8,
  },
});

export default BookingCheckoutScreen;
