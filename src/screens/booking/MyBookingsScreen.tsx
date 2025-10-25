import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {MyBookingsScreenNavigationProp} from '../../types/navigation';
import {Booking} from '../../types/booking';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import bookingService from '../../services/booking';

type TabType = 'upcoming' | 'past' | 'cancelled';

const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<MyBookingsScreenNavigationProp>();
  
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [activeTab])
  );

  const loadBookings = async (showRefresh: boolean = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const allBookings = await bookingService.getMyBookings();
      const filteredBookings = bookingService.filterBookingsByStatus(allBookings, activeTab);
      const sortedBookings = bookingService.sortBookingsByDate(
        filteredBookings,
        activeTab === 'upcoming'
      );

      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadBookings(true);
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetail', {bookingId: booking.id});
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (!bookingService.canCancelBooking(booking)) {
      Alert.alert(
        'Cannot Cancel',
        'Bookings can only be cancelled more than 24 hours before the appointment time.'
      );
      return;
    }

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => showCancellationReasons(booking),
        },
      ]
    );
  };

  const showCancellationReasons = (booking: Booking) => {
    const reasons = [
      'Change of plans',
      'Pet is unwell',
      'Provider unavailable',
      'Emergency',
      'Other',
    ];

    Alert.alert(
      'Cancellation Reason',
      'Please select a reason for cancellation:',
      reasons.map(reason => ({
        text: reason,
        onPress: () => confirmCancellation(booking, reason),
      }))
    );
  };

  const confirmCancellation = async (booking: Booking, reason: string) => {
    try {
      await bookingService.cancelBooking(booking.id, reason);
      Alert.alert('Success', 'Booking cancelled successfully');
      loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  const renderTabButton = (tab: TabType, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBookingCard = ({item: booking}: {item: Booking}) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => handleBookingPress(booking)}>
      <View style={styles.bookingHeader}>
        <View style={styles.providerInfo}>
          <Image
            source={{uri: booking.provider.avatar || 'https://via.placeholder.com/40'}}
            style={styles.providerAvatar}
          />
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>{booking.provider.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{booking.provider.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge,
          {backgroundColor: bookingService.getBookingStatusColor(booking.status)}
        ]}>
          <Text style={styles.statusText}>
            {bookingService.getBookingStatusText(booking.status)}
          </Text>
        </View>
      </View>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{booking.service.name}</Text>
        <Text style={styles.serviceType}>{booking.service.type}</Text>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Icon name="schedule" size={16} color="#666" />
          <Text style={styles.detailText}>
            {bookingService.formatBookingTime(booking.appointment_time)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.detailText}>
            {bookingService.formatDuration(booking.duration)}
          </Text>
        </View>

        {booking.pet && (
          <View style={styles.detailRow}>
            <Icon name="pets" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.pet.name}</Text>
          </View>
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>${booking.total_price.toFixed(2)}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="View Details"
          onPress={() => handleBookingPress(booking)}
          variant="outline"
          size="small"
          style={styles.actionButton}
        />

        {booking.status === 'confirmed' && (
          <Button
            title="Message"
            onPress={() => {/* Navigate to chat */}}
            variant="secondary"
            size="small"
            style={styles.actionButton}
          />
        )}

        {bookingService.canCancelBooking(booking) && (
          <Button
            title="Cancel"
            onPress={() => handleCancelBooking(booking)}
            variant="outline"
            size="small"
            style={[styles.actionButton, styles.cancelButton]}
            textStyle={styles.cancelButtonText}
          />
        )}

        {bookingService.canLeaveReview(booking) && (
          <Button
            title="Review"
            onPress={() => {/* Navigate to review screen */}}
            variant="primary"
            size="small"
            style={styles.actionButton}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="event-busy" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming' && 'No Upcoming Bookings'}
        {activeTab === 'past' && 'No Past Bookings'}
        {activeTab === 'cancelled' && 'No Cancelled Bookings'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming' && 'Book your first service to get started!'}
        {activeTab === 'past' && 'Your completed bookings will appear here.'}
        {activeTab === 'cancelled' && 'Your cancelled bookings will appear here.'}
      </Text>
      {activeTab === 'upcoming' && (
        <Button
          title="Browse Services"
          onPress={() => navigation.navigate('ServiceList')}
          variant="primary"
          style={styles.browseButton}
        />
      )}
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('upcoming', 'Upcoming')}
        {renderTabButton('past', 'Past')}
        {renderTabButton('cancelled', 'Cancelled')}
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    color: '#1C1C1E',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceInfo: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: 80,
  },
  cancelButton: {
    borderColor: '#F44336',
  },
  cancelButtonText: {
    color: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 32,
  },
});

export default MyBookingsScreen;