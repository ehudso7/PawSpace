import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Card, Button, Chip, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../../types/booking';
import { formatDistance } from '../../utils/distance';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
  onBookPress: () => void;
}

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 32; // Account for card margins
const IMAGE_HEIGHT = 200;

export function ServiceCard({ service, onPress, onBookPress }: ServiceCardProps) {
  const {
    title,
    provider,
    service_type,
    price,
    duration,
    images,
    rating,
    distance,
  } = service;

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const getServiceTypeColor = (type: string): string => {
    switch (type) {
      case 'grooming':
        return '#E3F2FD';
      case 'walking':
        return '#E8F5E8';
      case 'vet_care':
        return '#FFF3E0';
      case 'training':
        return '#F3E5F5';
      default:
        return '#F5F5F5';
    }
  };

  const getServiceTypeLabel = (type: string): string => {
    switch (type) {
      case 'grooming':
        return 'Grooming';
      case 'walking':
        return 'Walking';
      case 'vet_care':
        return 'Vet Care';
      case 'training':
        return 'Training';
      default:
        return type;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFD700" />
      );
    }

    return stars;
  };

  return (
    <Card style={styles.card} elevation={2}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {/* Image Carousel */}
        {images.length > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageContainer}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <Card.Content style={styles.content}>
          {/* Header with service type badge */}
          <View style={styles.header}>
            <Chip
              style={[
                styles.serviceTypeBadge,
                { backgroundColor: getServiceTypeColor(service_type) },
              ]}
              textStyle={styles.serviceTypeText}
            >
              {getServiceTypeLabel(service_type)}
            </Chip>
            {distance !== undefined && (
              <Text style={styles.distance}>{formatDistance(distance)}</Text>
            )}
          </View>

          {/* Service Title */}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          {/* Provider Info */}
          <View style={styles.providerRow}>
            <Avatar.Image
              size={32}
              source={{ uri: provider.avatar || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.providerInfo}>
              <View style={styles.providerNameRow}>
                <Text style={styles.providerName}>{provider.name}</Text>
                {provider.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                )}
              </View>
              <View style={styles.ratingRow}>
                <View style={styles.stars}>
                  {renderStars(rating)}
                </View>
                <Text style={styles.ratingText}>
                  {rating.toFixed(1)} ({provider.total_reviews})
                </Text>
              </View>
            </View>
          </View>

          {/* Price and Duration */}
          <View style={styles.priceRow}>
            <View style={styles.priceInfo}>
              <Text style={styles.price}>${price}</Text>
              <Text style={styles.duration}>• {formatDuration(duration)}</Text>
            </View>
            <Button
              mode="contained"
              onPress={onBookPress}
              style={styles.bookButton}
              contentStyle={styles.bookButtonContent}
              labelStyle={styles.bookButtonLabel}
            >
              Book Now
            </Button>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTypeBadge: {
    height: 28,
  },
  serviceTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  distance: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bookButton: {
    borderRadius: 20,
  },
  bookButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  bookButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});