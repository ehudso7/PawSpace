import React, { memo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import { Card, Avatar, Text, Chip, Button } from 'react-native-paper';
import { Service } from '@/types/booking';
import { formatDurationMinutes } from '@/utils/format';
import { formatDistance } from '@/utils/location';

interface Props {
  service: Service;
  distanceMiles?: number | null;
  onPress?: () => void;
  onBook?: () => void;
}

function ServiceCardComponent({ service, distanceMiles, onPress, onBook }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const idx = Math.round(contentOffset.x / Math.max(1, layoutMeasurement.width));
    if (idx !== imageIndex) setImageIndex(idx);
  };
  return (
    <Card mode="elevated" onPress={onPress} style={{ marginVertical: 8, overflow: 'hidden' }}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar.Image size={48} source={{ uri: service.provider.avatar_url }} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text variant="titleMedium" numberOfLines={1}>
            {service.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text variant="bodyMedium" style={{ opacity: 0.8 }} numberOfLines={1}>
              {service.provider.name} • ⭐ {service.rating.toFixed(1)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Chip compact style={{ marginRight: 8 }}>
              {service.service_type.replace('_', ' ')}
            </Chip>
            <Text variant="bodyMedium" style={{ marginRight: 8 }}>
              ${service.price} • {formatDurationMinutes(service.duration)}
            </Text>
            {distanceMiles !== null && distanceMiles !== undefined && (
              <Text variant="bodyMedium" style={{ marginLeft: 'auto', opacity: 0.8 }}>
                {formatDistance(distanceMiles)}
              </Text>
            )}
          </View>
        </View>
        <Button mode="contained" onPress={onBook} style={{ marginLeft: 8 }}>
          Book Now
        </Button>
      </Card.Content>
      {service.images?.length ? (
        <View style={{ marginTop: 8 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {service.images.map((uri, idx) => (
              <Card.Cover key={uri + idx} source={{ uri }} resizeMode="cover" style={{ width: '100%' }} />
            ))}
          </ScrollView>
          <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ color: 'white' }}>{imageIndex + 1}/{service.images.length}</Text>
          </View>
        </View>
      ) : null}
    </Card>
  );
}

export const ServiceCard = memo(ServiceCardComponent);
