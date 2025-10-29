import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import theme from '@/constants/theme';

interface ServiceCardProps {
  service: {
    title: string;
    description: string;
    imageUrl: string;
    duration: number;
    price: number;
    rating?: number;
  };
  onPress?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.imageUrl }} style={styles.image} />
          <View style={styles.duration}><Text style={styles.durationText}>{service.duration} min</Text></View>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
          <View style={styles.footer}>
            <Text style={styles.price}>${service.price}</Text>
            {typeof service.rating === 'number' ? <Text>{service.rating.toFixed(1)}</Text> : null}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16, padding: 0, overflow: 'hidden' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 150, resizeMode: 'cover' },
  duration: {
    position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  durationText: { color: '#fff', fontSize: 12 },
  content: { paddingTop: 12, gap: 8 },
  title: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  description: { fontSize: 14, color: theme.colors.gray },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 16, fontWeight: '600', color: theme.colors.primary },
});

export default ServiceCard;
