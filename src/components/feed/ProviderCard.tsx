import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Card from '@/components/common/Card';

interface ProviderCardProps {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  onPress: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  name,
  avatar,
  rating,
  reviewCount,
  specialties,
  onPress,
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.header}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.rating}>
              ⭐ {rating} ({reviewCount} reviews)
            </Text>
          </View>
        </View>
        <View style={styles.specialties}>
          {specialties.map((specialty, index) => (
            <Text key={index} style={styles.specialty}>
              {specialty}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialty: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 4,
  },
});

export default ProviderCard;