import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common';
import { theme } from '@/constants/theme';
import { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.header}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.title}>{provider.title}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color={theme.colors.warning || '#FFB300'} />
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount || 0} reviews)</Text>
            </View>
          </View>
        </View>
        
        {provider.description && (
          <Text style={styles.description} numberOfLines={2}>
            {provider.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={theme.colors.gray || '#999'} />
            <Text style={styles.location}>{provider.location}</Text>
          </View>
          <Text style={styles.price}>From ${provider.startingPrice}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.gray || '#DDD',
  },
  info: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text || '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: theme.colors.gray || '#666',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text || '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: theme.colors.gray || '#999',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text || '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border || '#EEE',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: theme.colors.gray || '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary || '#007AFF',
  },
});

export default ProviderCard;
