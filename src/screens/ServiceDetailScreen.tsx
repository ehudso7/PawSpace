import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';

import Button from '../components/Button';

const ServiceDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {service, provider} = route.params;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBookService = () => {
    // Check if selected date is in the future
    if (selectedDate <= new Date()) {
      Alert.alert('Invalid Date', 'Please select a future date and time');
      return;
    }

    navigation.navigate('BookingConfirm', {
      service,
      provider,
      appointmentTime: selectedDate.toISOString(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Provider Info */}
        <View style={styles.providerCard}>
          <Image
            source={{uri: provider.avatar}}
            style={styles.providerAvatar}
          />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>
                {provider.rating.toFixed(1)} ({provider.review_count} reviews)
              </Text>
            </View>
            {provider.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={16} color="#4CAF50" />
                <Text style={styles.verifiedText}>Verified Provider</Text>
              </View>
            )}
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceType}>{service.type}</Text>
          <Text style={styles.description}>{service.description}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Icon name="attach-money" size={20} color="#666" />
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>${service.price.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="access-time" size={20} color="#666" />
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{service.duration} minutes</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="location-on" size={20} color="#666" />
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{service.location}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.dateCard}>
          <Text style={styles.cardTitle}>Select Date & Time</Text>
          
          <Button
            title={`Selected: ${selectedDate.toLocaleDateString()} ${selectedDate.toLocaleTimeString()}`}
            onPress={() => setShowDatePicker(true)}
            variant="outline"
            style={styles.dateButton}
          />

          <DatePicker
            modal
            open={showDatePicker}
            date={selectedDate}
            onConfirm={(date) => {
              setShowDatePicker(false);
              setSelectedDate(date);
            }}
            onCancel={() => {
              setShowDatePicker(false);
            }}
            minimumDate={new Date()}
          />
        </View>

        {/* Provider Bio */}
        {provider.bio && (
          <View style={styles.bioCard}>
            <Text style={styles.cardTitle}>About {provider.name}</Text>
            <Text style={styles.bioText}>{provider.bio}</Text>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bottomContainer}>
        <Button
          title={`Book for $${service.price.toFixed(2)}`}
          onPress={handleBookService}
          size="large"
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
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
  serviceName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 16,
    color: '#007AFF',
    textTransform: 'capitalize',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  dateCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  dateButton: {
    width: '100%',
  },
  bioCard: {
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
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  bookButton: {
    width: '100%',
  },
});

export default ServiceDetailScreen;