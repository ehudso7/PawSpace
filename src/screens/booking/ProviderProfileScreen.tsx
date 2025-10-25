import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  FlatList,
  Linking,
} from 'react-native';
import { ProviderProfile, Service } from '../../types/booking';
import { BookingService } from '../../services/bookingService';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 300;
const AVATAR_SIZE = 100;

interface ProviderProfileScreenProps {
  providerId: string;
  onBookService: (service: Service) => void;
  onMessage: () => void;
  onShare: () => void;
}

export const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({
  providerId,
  onBookService,
  onMessage,
  onShare,
}) => {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'portfolio' | 'reviews'>('about');
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchProviderProfile();
  }, [providerId]);

  const fetchProviderProfile = async () => {
    setLoading(true);
    try {
      const profile = await BookingService.getProviderProfile(providerId);
      setProvider(profile);
    } catch (error) {
      console.error('Error fetching provider profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service: Service) => {
    setShowServiceSelector(false);
    onBookService(service);
  };

  const renderHeader = () => {
    if (!provider) return null;

    const headerTranslateY = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT / 2],
      extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT / 2],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        {/* Cover Photo */}
        <Animated.View style={[styles.coverPhotoContainer, { opacity: imageOpacity }]}>
          <Image
            source={{
              uri: provider.cover_photo_url || 'https://via.placeholder.com/400x300/f0f0f0/999999?text=Cover+Photo',
            }}
            style={styles.coverPhoto}
            resizeMode="cover"
          />
          <View style={styles.coverOverlay} />
        </Animated.View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: provider.avatar_url || 'https://via.placeholder.com/100x100/e0e0e0/999999?text=Avatar',
              }}
              style={styles.avatar}
            />
          </View>

          {/* Provider Info */}
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.full_name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {provider.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({provider.total_reviews} reviews)</Text>
            </View>
            
            {/* Service Type Badges */}
            <View style={styles.badgesContainer}>
              {provider.service_types.slice(0, 3).map((type, index) => (
                <View key={index} style={styles.serviceBadge}>
                  <Text style={styles.serviceBadgeText}>{type}</Text>
                </View>
              ))}
              {provider.service_types.length > 3 && (
                <View style={styles.serviceBadge}>
                  <Text style={styles.serviceBadgeText}>+{provider.service_types.length - 3}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderTabs = () => {
    const tabs = [
      { key: 'about', label: 'About' },
      { key: 'services', label: 'Services' },
      { key: 'portfolio', label: 'Portfolio' },
      { key: 'reviews', label: 'Reviews' },
    ] as const;

    return (
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderAboutTab = () => {
    if (!provider) return null;

    return (
      <View style={styles.tabContent}>
        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{provider.bio}</Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>
            {provider.location.address}, {provider.location.city}, {provider.location.state}
          </Text>
          <TouchableOpacity style={styles.mapButton}>
            <Text style={styles.mapButtonText}>View on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          {Object.entries(provider.business_hours).map(([day, hours]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
              <Text style={styles.hoursText}>
                {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{provider.total_bookings}</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{provider.total_reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{provider.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderServicesTab = () => {
    if (!provider) return null;

    return (
      <View style={styles.tabContent}>
        {provider.services.map(service => (
          <View key={service.id} style={styles.serviceItem}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceDuration}>{service.duration} min</Text>
                <Text style={styles.servicePrice}>${service.price}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleBookService(service)}
            >
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderPortfolioTab = () => {
    if (!provider) return null;

    return (
      <View style={styles.tabContent}>
        <FlatList
          data={provider.portfolio_items}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.portfolioItem}>
              <View style={styles.beforeAfterContainer}>
                <View style={styles.imageContainer}>
                  <Text style={styles.imageLabel}>Before</Text>
                  <Image source={{ uri: item.before_image_url }} style={styles.portfolioImage} />
                </View>
                <View style={styles.imageContainer}>
                  <Text style={styles.imageLabel}>After</Text>
                  <Image source={{ uri: item.after_image_url }} style={styles.portfolioImage} />
                </View>
              </View>
              <Text style={styles.portfolioDescription}>{item.description}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const renderReviewsTab = () => {
    if (!provider) return null;

    return (
      <View style={styles.tabContent}>
        {provider.reviews.map(review => (
          <View key={review.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Image
                source={{
                  uri: review.user_avatar || 'https://via.placeholder.com/40x40/e0e0e0/999999?text=U',
                }}
                style={styles.reviewAvatar}
              />
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewerName}>{review.user_name}</Text>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, i) => (
                    <Text key={i} style={[styles.star, i < review.rating && styles.filledStar]}>
                      ★
                    </Text>
                  ))}
                </View>
              </View>
              <Text style={styles.reviewDate}>
                {new Date(review.created_at).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            {review.service_type && (
              <Text style={styles.reviewService}>Service: {review.service_type}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return renderAboutTab();
      case 'services':
        return renderServicesTab();
      case 'portfolio':
        return renderPortfolioTab();
      case 'reviews':
        return renderReviewsTab();
      default:
        return null;
    }
  };

  const renderStickyBottomBar = () => {
    return (
      <View style={styles.stickyBottomBar}>
        <TouchableOpacity
          style={styles.bookServiceButton}
          onPress={() => setShowServiceSelector(true)}
        >
          <Text style={styles.bookServiceButtonText}>Book Service</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading provider profile...</Text>
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Provider not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {renderHeader()}
        {renderTabs()}
        {renderTabContent()}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
      {renderStickyBottomBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
  },
  header: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  coverPhotoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT * 0.7,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  providerInfo: {
    alignItems: 'center',
  },
  providerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  reviewCount: {
    fontSize: 14,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  serviceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  serviceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  messageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  shareButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  mapButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  hoursText: {
    fontSize: 16,
    color: '#666666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  bookButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  portfolioItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  beforeAfterContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
  },
  imageLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  portfolioImage: {
    width: '100%',
    height: 120,
  },
  portfolioDescription: {
    padding: 12,
    fontSize: 14,
    color: '#666666',
  },
  reviewItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  filledStar: {
    color: '#FFD700',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666666',
  },
  reviewComment: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666666',
    marginBottom: 8,
  },
  reviewService: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  bookServiceButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookServiceButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomSpacer: {
    height: 80, // Space for sticky bottom bar
  },
});