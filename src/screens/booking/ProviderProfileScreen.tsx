import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { ProviderProfile, Service } from '../../types/booking';
import ServiceSelectorSheet from '../../components/booking/ServiceSelectorSheet';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 300;
const AVATAR_SIZE = 100;

interface ProviderProfileScreenProps {
  route: {
    params: {
      providerId: string;
    };
  };
  navigation: any;
}

const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({ route, navigation }) => {
  const { providerId } = route.params;
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetchProviderProfile();
  }, [providerId]);

  const fetchProviderProfile = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockProvider: ProviderProfile = {
        id: providerId,
        full_name: 'Sarah Johnson',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        cover_photo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300&fit=crop',
        bio: 'Professional beauty specialist with 8+ years of experience. Specializing in hair styling, makeup, and skincare treatments. Committed to helping you look and feel your best.',
        location: {
          address: '123 Beauty Lane',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
        },
        rating: 4.8,
        total_reviews: 127,
        total_bookings: 342,
        services: [
          {
            id: '1',
            title: 'Hair Cut & Style',
            description: 'Professional haircut with styling',
            duration: 60,
            price: 85,
            category: 'Hair',
            is_active: true,
          },
          {
            id: '2',
            title: 'Full Face Makeup',
            description: 'Complete makeup application',
            duration: 90,
            price: 120,
            category: 'Makeup',
            is_active: true,
          },
          {
            id: '3',
            title: 'Facial Treatment',
            description: 'Deep cleansing facial with mask',
            duration: 75,
            price: 95,
            category: 'Skincare',
            is_active: true,
          },
        ],
        business_hours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '10:00', close: '17:00' },
          sunday: { open: '10:00', close: '16:00' },
        },
        portfolio_items: [
          {
            id: '1',
            title: 'Bridal Makeup',
            description: 'Elegant bridal look with natural finish',
            before_image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop',
            after_image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
            category: 'Makeup',
            created_at: '2024-01-15',
          },
          {
            id: '2',
            title: 'Hair Transformation',
            description: 'Dramatic color change and styling',
            before_image_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=400&fit=crop',
            after_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=400&fit=crop',
            category: 'Hair',
            created_at: '2024-01-10',
          },
        ],
        reviews: [
          {
            id: '1',
            user_name: 'Emily Chen',
            user_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
            rating: 5,
            comment: 'Sarah is absolutely amazing! She made me feel so comfortable and the results exceeded my expectations.',
            created_at: '2024-01-20',
            service_name: 'Hair Cut & Style',
          },
          {
            id: '2',
            user_name: 'Jessica Martinez',
            user_avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
            rating: 5,
            comment: 'Professional, friendly, and incredibly talented. I will definitely be booking again!',
            created_at: '2024-01-18',
            service_name: 'Full Face Makeup',
          },
        ],
      };
      
      setProvider(mockProvider);
    } catch (error) {
      console.error('Error fetching provider profile:', error);
      Alert.alert('Error', 'Failed to load provider profile');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacityValue = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - AVATAR_SIZE],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const handleBookService = () => {
    setShowServiceSelector(true);
  };

  const handleServiceSelect = (service: Service) => {
    setShowServiceSelector(false);
    navigation.navigate('BookingCalendar', {
      providerId,
      service,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < Math.floor(rating) ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  const renderTabContent = () => {
    if (!provider) return null;

    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.bioText}>{provider.bio}</Text>
            
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: provider.location.coordinates.latitude,
                    longitude: provider.location.coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={provider.location.coordinates}
                    title={provider.full_name}
                  />
                </MapView>
              </View>
              <Text style={styles.addressText}>
                {provider.location.address}, {provider.location.city}, {provider.location.state} {provider.location.zipCode}
              </Text>
            </View>

            <View style={styles.businessHoursSection}>
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
          </View>
        );

      case 'services':
        return (
          <View style={styles.tabContent}>
            {provider.services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                </View>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.serviceFooter}>
                  <View style={styles.serviceBadge}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.serviceDuration}>{service.duration} min</Text>
                  </View>
                  <View style={styles.serviceBadge}>
                    <Ionicons name="pricetag-outline" size={16} color="#666" />
                    <Text style={styles.serviceCategory}>{service.category}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );

      case 'portfolio':
        return (
          <View style={styles.tabContent}>
            <View style={styles.portfolioGrid}>
              {provider.portfolio_items.map((item) => (
                <View key={item.id} style={styles.portfolioItem}>
                  <View style={styles.portfolioImages}>
                    <Image source={{ uri: item.before_image_url }} style={styles.portfolioImage} />
                    <Image source={{ uri: item.after_image_url }} style={styles.portfolioImage} />
                  </View>
                  <Text style={styles.portfolioTitle}>{item.title}</Text>
                  <Text style={styles.portfolioDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <View style={styles.starsContainer}>
                {renderStars(provider.rating)}
              </View>
              <Text style={styles.reviewsCount}>({provider.total_reviews} reviews)</Text>
            </View>
            
            {provider.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.user_avatar_url }} style={styles.reviewAvatar} />
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
                <Text style={styles.reviewService}>{review.service_name}</Text>
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load provider profile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with parallax effect */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacityValue,
          },
        ]}
      >
        <Image source={{ uri: provider.cover_photo_url }} style={styles.coverPhoto} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.coverGradient}
        />
        
        <View style={styles.headerContent}>
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ scale: avatarScale }] },
            ]}
          >
            <Image source={{ uri: provider.avatar_url }} style={styles.avatar} />
          </Animated.View>
          
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.full_name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(provider.rating)}
              </View>
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <Text style={styles.reviewsCount}>({provider.total_reviews})</Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{provider.total_bookings}</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{provider.total_reviews}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['about', 'services', 'portfolio', 'reviews'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
          <Text style={styles.bookButtonText}>Book Service</Text>
        </TouchableOpacity>
      </View>

      {/* Service Selector Sheet */}
      <ServiceSelectorSheet
        visible={showServiceSelector}
        services={provider.services}
        onClose={() => setShowServiceSelector(false)}
        onServiceSelect={handleServiceSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    height: HEADER_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: '#fff',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: HEADER_HEIGHT - 50,
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  tabContent: {
    paddingTop: 20,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
  },
  businessHoursSection: {
    marginBottom: 24,
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
    color: '#333',
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
  },
  serviceCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  serviceCategory: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    marginBottom: 16,
  },
  portfolioImages: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  portfolioImage: {
    width: '48%',
    height: 120,
    borderRadius: 8,
    marginRight: 4,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  portfolioDescription: {
    fontSize: 12,
    color: '#666',
  },
  reviewsHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reviewCard: {
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
  reviewUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewService: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  bottomBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProviderProfileScreen;