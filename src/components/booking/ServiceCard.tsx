import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Avatar,
  Badge,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Service } from '../../types/booking';
import { formatDistance } from '../../utils/geolocation';

interface ServiceCardProps {
  service: Service;
  distance?: number;
  index?: number;
}

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 32;
const IMAGE_HEIGHT = 180;

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  distance,
  index = 0,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardPress = () => {
    navigation.navigate('ProviderProfile', {
      providerId: service.provider_id,
      serviceId: service.id,
    });
  };

  const handleBookNow = (e: any) => {
    e.stopPropagation();
    navigation.navigate('BookService', {
      serviceId: service.id,
    });
  };

  const getServiceTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      grooming: '#FF6B9D',
      walking: '#4CAF50',
      vet_care: '#2196F3',
      training: '#FF9800',
    };
    return colors[type] || theme.colors.primary;
  };

  const getServiceTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      grooming: 'Grooming',
      walking: 'Walking',
      vet_care: 'Vet Care',
      training: 'Training',
    };
    return labels[type] || type;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={`star-${i}`} style={styles.star}>
          ★
        </Text>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Text key="half-star" style={styles.star}>
          ★
        </Text>
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} style={styles.emptyStar}>
          ★
        </Text>
      );
    }
    return stars;
  };

  const handleScroll = (event: any) => {
    const slideSize = IMAGE_WIDTH;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100)}
      style={styles.container}
    >
      <Card style={styles.card} onPress={handleCardPress}>
        {/* Header Section */}
        <View style={styles.header}>
          <Avatar.Image
            size={50}
            source={{ uri: service.provider.avatar }}
            style={styles.avatar}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title} numberOfLines={1}>
              {service.title}
            </Text>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName} numberOfLines={1}>
                {service.provider.name}
              </Text>
              {service.provider.verified && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>{renderStars(service.rating)}</View>
              <Text style={styles.ratingText}>
                {service.rating.toFixed(1)} ({service.provider.total_reviews})
              </Text>
            </View>
          </View>
          <Button
            mode="contained"
            onPress={handleBookNow}
            style={styles.bookButton}
            labelStyle={styles.bookButtonLabel}
            compact
          >
            Book Now
          </Button>
        </View>

        {/* Image Carousel */}
        {service.images && service.images.length > 0 && (
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {service.images.map((image, idx) => (
                <Image
                  key={idx}
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            {service.images.length > 1 && (
              <View style={styles.pagination}>
                {service.images.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.paginationDot,
                      currentImageIndex === idx && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Badge
              style={[
                styles.badge,
                { backgroundColor: getServiceTypeColor(service.service_type) },
              ]}
            >
              {getServiceTypeLabel(service.service_type)}
            </Badge>
            <Text style={styles.priceText}>
              ${service.price.toFixed(2)}
              <Text style={styles.durationText}> / {service.duration} min</Text>
            </Text>
          </View>
          {distance !== undefined && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceIcon}>📍</Text>
              <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
            </View>
          )}
          {service.total_bookings > 0 && (
            <Text style={styles.popularityText}>
              {service.total_bookings} bookings
            </Text>
          )}
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#E0E0E0',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  star: {
    fontSize: 14,
    color: '#FFB300',
  },
  emptyStar: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  ratingText: {
    fontSize: 12,
    color: '#666666',
  },
  bookButton: {
    borderRadius: 8,
    marginLeft: 8,
  },
  bookButtonLabel: {
    fontSize: 12,
    paddingHorizontal: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    opacity: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoSection: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666666',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#666666',
  },
  popularityText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
});
