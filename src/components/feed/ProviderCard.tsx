import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import theme from '@/constants/theme';

interface ProviderCardProps {
  provider: {
    name: string;
    title: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    description: string;
    location: string;
    startingPrice: number;
  };
  onPress?: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.title}>{provider.title}</Text>
            <Text>{provider.rating.toFixed(1)} ({provider.reviewCount})</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>{provider.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.location}>{provider.location}</Text>
          <Text style={styles.price}>From ${provider.startingPrice}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  info: { marginLeft: 12, flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  title: { fontSize: 12, color: theme.colors.gray },
  description: { fontSize: 14, color: theme.colors.text, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  location: { fontSize: 12, color: theme.colors.gray },
  price: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
});

export default ProviderCard;
