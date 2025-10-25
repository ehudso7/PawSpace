import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

export type ServiceCardProps = ViewProps & {
  title?: string;
  price?: string;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ title = 'Service', price = '$0.00', style, ...rest }) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12
  },
  title: {
    fontWeight: '600'
  },
  price: {
    color: '#6b7280',
    marginTop: 4
  }
});
