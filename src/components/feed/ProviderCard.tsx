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
      <TouchableOpacity onPress={onPress}>
        <View style={styles.header}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.title}>{provider.title}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color={theme.colors.warning} />
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount} reviews)</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {provider.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.location}>
            <Ionicons name="location-outline" size={14} color={theme.colors.gray} />
            {' '}{provider.location}
          </Text>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  title: {
    fontSize: 14,
    color: theme.colors.gray,
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 12,
    color: theme.colors.gray,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: theme.colors.gray,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default ProviderCard;