import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Booking } from '../../types/booking';
import { getMyBookings, cancelBooking } from '../../services/bookings';

type TabType = 'upcoming' | 'past' | 'cancelled';

const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async (tab: TabType) => {
    try {
      setLoading(true);
      const data = await getMyBookings(tab);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings(activeTab);
    setRefreshing(false);
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      loadBookings(activeTab);
    }, [activeTab])
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetail', { bookingId: booking.id });
  };

  const handleCancelBooking = async (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(booking.id, 'User requested cancellation');
              await loadBookings(activeTab);
              Alert.alert('Success', 'Booking has been cancelled');
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleMessageProvider = (booking: Booking) => {
    // Navigate to chat with provider
    navigation.navigate('Chat', { 
      providerId: booking.provider.id,
      bookingId: booking.id 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays === -1) {
      return 'Yesterday';
    } else if (diffDays > 0) {
      return `In ${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  };

  const renderBookingCard = ({ item: booking }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => handleBookingPress(booking)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.providerInfo}>
          <Image
            source={{ uri: booking.provider.avatar || 'https://via.placeholder.com/40' }}
            style={styles.providerAvatar}
          />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{booking.provider.business_name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{booking.provider.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{booking.service.name}</Text>
        <Text style={styles.serviceType}>{booking.service.type}</Text>
      </View>

      <View style={styles.dateTimeInfo}>
        <View style={styles.dateTimeItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateTimeText}>
            {new Date(booking.appointment_time).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.dateTimeItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.dateTimeText}>
            {new Date(booking.appointment_time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        <Text style={styles.relativeTime}>{formatDateTime(booking.appointment_time)}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Total</Text>
        <Text style={styles.priceValue}>${booking.total_price.toFixed(2)}</Text>
      </View>

      {booking.status === 'confirmed' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMessageProvider(booking)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#007AFF" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleCancelBooking(booking)}
          >
            <Ionicons name="close-circle-outline" size={16} color="#F44336" />
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {booking.status === 'completed' && (
        <TouchableOpacity style={styles.reviewButton}>
          <Ionicons name="star-outline" size={16} color="#FFD700" />
          <Text style={styles.reviewButtonText}>Leave Review</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming' 
          ? "You don't have any upcoming bookings"
          : `You don't have any ${activeTab} bookings`
        }
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() => navigation.navigate('ServiceList')}
        >
          <Text style={styles.bookNowButtonText}>Book a Service</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const tabs = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => handleTabChange(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  serviceInfo: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
  },
  dateTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  relativeTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 'auto',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  cancelButton: {
    borderColor: '#F44336',
  },
  cancelButtonText: {
    color: '#F44336',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  reviewButtonText: {
    fontSize: 14,
    color: '#FFD700',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  bookNowButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookNowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default MyBookingsScreen;