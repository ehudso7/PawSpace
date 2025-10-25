import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/common';

interface ProviderCardProps {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  services: string[];
  onPress?: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  name,
  avatar,
  rating,
  services,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.services}>
          {services.map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  serviceTag: {
    backgroundColor: '#E5F0FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  serviceText: {
    fontSize: 12,
    color: '#007AFF',
  },
});

export default ProviderCard;
