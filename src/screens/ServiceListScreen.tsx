import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Service, ProviderProfile} from '../types/booking';

// Mock data for demonstration
const mockServices: (Service & {provider: ProviderProfile})[] = [
  {
    id: '1',
    provider_id: 'provider1',
    name: 'Dog Walking',
    description: 'Professional dog walking service in your neighborhood',
    type: 'walking',
    price: 25.00,
    duration: 60,
    location: '123 Main St, San Francisco, CA',
    available_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    available_hours: {start: '08:00', end: '18:00'},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    provider: {
      id: 'provider1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://via.placeholder.com/50',
      rating: 4.8,
      review_count: 127,
      bio: 'Experienced dog walker with 5+ years of experience',
      location: 'San Francisco, CA',
      verified: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: '2',
    provider_id: 'provider2',
    name: 'Pet Grooming',
    description: 'Full service pet grooming including bath, nail trim, and styling',
    type: 'grooming',
    price: 75.00,
    duration: 120,
    location: '456 Oak Ave, San Francisco, CA',
    available_days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    available_hours: {start: '09:00', end: '17:00'},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    provider: {
      id: 'provider2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      avatar: 'https://via.placeholder.com/50',
      rating: 4.9,
      review_count: 89,
      bio: 'Professional pet groomer specializing in all breeds',
      location: 'San Francisco, CA',
      verified: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
];

const ServiceListScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleServicePress = (service: Service & {provider: ProviderProfile}) => {
    navigation.navigate('ServiceDetail', {
      service,
      provider: service.provider,
    });
  };

  const renderServiceCard = ({item}: {item: Service & {provider: ProviderProfile}}) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => handleServicePress(item)}>
      <View style={styles.serviceHeader}>
        <Image
          source={{uri: item.provider.avatar}}
          style={styles.providerAvatar}
        />
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.providerName}>{item.provider.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.provider.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.duration}>{item.duration} min</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.serviceFooter}>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Text style={styles.serviceType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pet Services</Text>
        <Text style={styles.subtitle}>Find the perfect care for your pet</Text>
      </View>
      
      <FlatList
        data={mockServices}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  providerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  serviceType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

export default ServiceListScreen;