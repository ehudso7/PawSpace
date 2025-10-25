import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * Example component showing how to navigate to the provider profile
 * and start the booking flow
 */
const BookingExample: React.FC = () => {
  const navigation = useNavigation();

  const handleViewProvider = (providerId: string) => {
    navigation.navigate('BookingStack', {
      screen: 'ProviderProfile',
      params: { providerId },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking System Example</Text>
      <Text style={styles.description}>
        Tap the button below to view a provider profile and start the booking process.
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleViewProvider('provider-123')}
      >
        <Text style={styles.buttonText}>View Provider Profile</Text>
      </TouchableOpacity>
      
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Features Included:</Text>
        <Text style={styles.featureItem}>• Provider profile with parallax header</Text>
        <Text style={styles.featureItem}>• Service selector bottom sheet</Text>
        <Text style={styles.featureItem}>• Interactive calendar with availability</Text>
        <Text style={styles.featureItem}>• Time slot picker with real-time availability</Text>
        <Text style={styles.featureItem}>• Booking confirmation screen</Text>
        <Text style={styles.featureItem}>• Smooth animations and loading states</Text>
        <Text style={styles.featureItem}>• Responsive design for all screen sizes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  features: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default BookingExample;