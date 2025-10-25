import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Text, Appbar, Avatar, Chip, Button } from 'react-native-paper';
import { Service } from '@/types/booking';

export default function ProviderProfileScreen() {
  const route = useRoute<any>();
  const service: Service | undefined = route.params?.service;

  if (!service) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No provider data.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title={service.provider.name} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar.Image size={64} source={{ uri: service.provider.avatar_url }} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text variant="titleLarge">{service.provider.name}</Text>
            <Text>⭐ {service.rating.toFixed(1)} • {service.provider.total_reviews} reviews</Text>
            <Chip style={{ alignSelf: 'flex-start', marginTop: 6 }}>{service.service_type.replace('_',' ')}</Chip>
          </View>
        </View>
        <Image source={{ uri: service.images?.[0] }} style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 16 }} />
        <Text variant="titleMedium" style={{ marginTop: 16 }}>{service.title}</Text>
        <Text style={{ marginTop: 8 }}>{service.description}</Text>
        <Button mode="contained" style={{ marginTop: 16 }}>Book Now</Button>
      </ScrollView>
    </View>
  );
}
