import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/common';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  onPress?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  price,
  duration,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.footer}>
            <Text style={styles.price}>${price}</Text>
            <Text style={styles.duration}>{duration} min</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
});

export default ServiceCard;
