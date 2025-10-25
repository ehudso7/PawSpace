import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, useTheme, Avatar } from 'react-native-paper';
import { Service } from '../../types/service';
import { SERVICE_TYPE_LABEL } from '../../constants/services';
import { formatMiles, haversineDistanceMiles } from '../../utils/geo';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

interface Props {
  service: Service;
  userLocation?: { latitude: number; longitude: number } | null;
  onPress?: (service: Service) => void;
  onBook?: (service: Service) => void;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const arr = Array.from({ length: 5 }, (_, i) => (i < full ? '★' : i === full && half ? '☆' : '☆'));
  return (
    <Text accessibilityLabel={`Rating ${rating.toFixed(1)} out of 5`}>{arr.join(' ')} {rating.toFixed(1)}</Text>
  );
};

export const ServiceCard: React.FC<Props> = memo(({ service, userLocation, onPress, onBook }) => {
  const theme = useTheme();
  const distance = userLocation ? haversineDistanceMiles(userLocation, service.location) : undefined;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition}
      style={{ marginBottom: 12 }}
    >
      <Card onPress={() => onPress?.(service)}>
        {/* Carousel */}
        <View style={{ height: 180 }}>
          <Carousel
            width={styles.carousel.width as number}
            height={180}
            autoPlay
            data={service.images}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />)
            }
          />
        </View>

        <Card.Content style={styles.contentRow}>
          <Avatar.Image size={48} source={{ uri: service.provider.avatarUrl }} />
          <View style={styles.info}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>{service.title}</Text>
            <Text variant="bodyMedium" numberOfLines={1}>{service.provider.name}</Text>
            <RatingStars rating={service.rating} />
            <View style={styles.badgeRow}>
              <Chip compact style={styles.badge}>
                {SERVICE_TYPE_LABEL[service.service_type]}
              </Chip>
              {!!distance && (
                <Chip compact style={styles.badge} icon="map-marker-distance">
                  {formatMiles(distance)}
                </Chip>
              )}
              <Chip compact style={styles.badge} icon="clock-outline">{service.duration} min</Chip>
            </View>
          </View>
          <View style={styles.right}>
            <Text variant="titleMedium">${service.price}</Text>
            <Button mode="contained" onPress={() => onBook?.(service)}>Book Now</Button>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  carousel: { width: 360 },
  image: { width: '100%', height: '100%' },
  contentRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12 },
  info: { flex: 1 },
  title: { fontWeight: 'bold' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  badge: {},
  right: { alignItems: 'flex-end', gap: 6 },
});
