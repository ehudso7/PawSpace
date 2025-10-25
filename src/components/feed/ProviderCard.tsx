import React from 'react';
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/common';
=======
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Card from '@/components/common/Card';
>>>>>>> origin/main

interface ProviderCardProps {
  id: string;
  name: string;
  avatar: string;
  rating: number;
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
        <View style={styles.header}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
>>>>>>> origin/main
  );
};

const styles = StyleSheet.create({
  card: {
<<<<<<< HEAD
    marginBottom: 16,
=======
<<<<<<< HEAD
    marginBottom: 16,
=======
    marginBottom: 12,
>>>>>>> origin/main
>>>>>>> origin/main
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 12,
=======
<<<<<<< HEAD
>>>>>>> origin/main
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
<<<<<<< HEAD
  },
  info: {
    marginLeft: 12,
=======
    backgroundColor: '#F0F0F0',
  },
  info: {
    marginLeft: 12,
=======
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
>>>>>>> origin/main
>>>>>>> origin/main
    flex: 1,
  },
  name: {
    fontSize: 18,
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
    fontWeight: '600',
    color: '#333',
=======
    fontWeight: 'bold',
>>>>>>> origin/main
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
>>>>>>> origin/main
