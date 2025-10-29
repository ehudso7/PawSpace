import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { ProviderProfile, Service } from '../../types/booking.types';
import { getProviderProfile } from '../../services/bookings.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface ProviderProfileScreenProps {
  providerId: string;
  onBookService: (service: Service) => void;
  onMessage?: () => void;
  onShare?: () => void;
}

type TabType = 'about' | 'services' | 'portfolio' | 'reviews';

export const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({
  providerId,
  onBookService,
  onMessage,
  onShare,
}) => {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    loadProfile();
  }, [providerId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProviderProfile(providerId);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= Math.floor(rating) ? '★' : i <= rating ? '☆' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bioText}>{profile?.bio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.text}>
          {profile?.location.address}, {profile?.location.city},{' '}
          {profile?.location.state} {profile?.location.zip_code}
        </Text>
        {/* In production, add a map component here */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>📍 Map View</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {profile?.phone && (
          <Text style={styles.text}>📱 {profile.phone}</Text>
        )}
        {profile?.email && (
          <Text style={styles.text}>📧 {profile.email}</Text>
        )}
        {profile?.response_time && (
          <Text style={styles.responseTime}>⏰ {profile.response_time}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        {Object.entries(profile?.business_hours || {}).map(([day, hours]) => (
          <View key={day} style={styles.hourRow}>
            <Text style={styles.dayText}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>
            <Text style={styles.timeText}>
              {hours.open} - {hours.close}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderServicesTab = () => (
    <View style={styles.tabContent}>
      {profile?.services.map((service) => (
        <TouchableOpacity
          key={service.id}
          style={styles.serviceCard}
          onPress={() => {
            setShowServiceSelector(false);
            onBookService(service);
          }}
        >
          <View style={styles.serviceHeader}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceCategory}>{service.category}</Text>
            </View>
            <View style={styles.servicePricing}>
              <Text style={styles.servicePrice}>${service.price}</Text>
              <Text style={styles.serviceDuration}>{service.duration} min</Text>
            </View>
          </View>
          <Text style={styles.serviceDescription}>{service.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPortfolioTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.portfolioGrid}>
        {profile?.portfolio_items.map((item) => (
          <View key={item.id} style={styles.portfolioItem}>
            <View style={styles.beforeAfterContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.before_image_url }}
                  style={styles.portfolioImage}
                />
                <Text style={styles.imageLabel}>Before</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.after_image_url }}
                  style={styles.portfolioImage}
                />
                <Text style={styles.imageLabel}>After</Text>
              </View>
            </View>
            {item.description && (
              <Text style={styles.portfolioDescription}>{item.description}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      {profile?.reviews?.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image
              source={{ uri: review.user_avatar || 'https://i.pravatar.cc/50' }}
              style={styles.reviewAvatar}
            />
            <View style={styles.reviewInfo}>
              <Text style={styles.reviewUserName}>{review.user_name}</Text>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
              </View>
            </View>
            <Text style={styles.reviewDate}>
              {new Date(review.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  const renderServiceSelector = () => (
    <Modal
      visible={showServiceSelector}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowServiceSelector(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select a Service</Text>
            <TouchableOpacity onPress={() => setShowServiceSelector(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {profile?.services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.modalServiceCard}
                onPress={() => {
                  setShowServiceSelector(false);
                  onBookService(service);
                }}
              >
                <View style={styles.modalServiceInfo}>
                  <Text style={styles.modalServiceTitle}>{service.title}</Text>
                  <Text style={styles.modalServiceDuration}>
                    {service.duration} minutes
                  </Text>
                </View>
                <Text style={styles.modalServicePrice}>${service.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load provider profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.scrollContent}>
          {/* Tabs */}
          <View style={styles.tabs}>
            {(['about', 'services', 'portfolio', 'reviews'] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'about' && renderAboutTab()}
          {activeTab === 'services' && renderServicesTab()}
          {activeTab === 'portfolio' && renderPortfolioTab()}
          {activeTab === 'reviews' && renderReviewsTab()}
        </View>
      </Animated.ScrollView>

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Animated.Image
          source={{ uri: profile.cover_photo_url }}
          style={[
            styles.coverPhoto,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        />
        <View style={styles.headerContent}>
          <Image
            source={{ uri: profile.avatar_url }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.providerName}>{profile.full_name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>{renderStars(profile.rating)}</View>
              <Text style={styles.ratingText}>
                {profile.rating} ({profile.total_reviews} reviews)
              </Text>
            </View>
            <View style={styles.badges}>
              {profile.service_types.map((type) => (
                <View key={type} style={styles.badge}>
                  <Text style={styles.badgeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
            <Text style={styles.actionButtonText}>💬 Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Text style={styles.actionButtonText}>🔗 Share</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setShowServiceSelector(true)}
        >
          <Text style={styles.bookButtonText}>Book Service</Text>
        </TouchableOpacity>
      </View>

      {renderServiceSelector()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    marginTop: HEADER_MAX_HEIGHT + 80,
    paddingBottom: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT + 80,
    zIndex: 10,
  },
  coverPhoto: {
    width: SCREEN_WIDTH,
    height: HEADER_MAX_HEIGHT,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: -40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    color: '#FFB300',
    fontSize: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6200EE',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#6200EE',
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#6200EE',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  text: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  responseTime: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 8,
    fontWeight: '500',
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#666666',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
  },
  serviceCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '500',
  },
  servicePricing: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  serviceDuration: {
    fontSize: 12,
    color: '#666666',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  portfolioGrid: {
    gap: 16,
  },
  portfolioItem: {
    marginBottom: 16,
  },
  beforeAfterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  imageWrapper: {
    flex: 1,
  },
  portfolioImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  imageLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  portfolioDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
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
  },
  reviewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666666',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bookButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    fontSize: 24,
    color: '#666666',
  },
  modalScroll: {
    padding: 16,
  },
  modalServiceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalServiceInfo: {
    flex: 1,
  },
  modalServiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  modalServiceDuration: {
    fontSize: 12,
    color: '#666666',
  },
  modalServicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
  },
});

export default ProviderProfileScreen;
