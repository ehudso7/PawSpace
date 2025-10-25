import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Card from '@/components/common/Card';

interface TransformationCardProps {
  id: string;
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
  providerName: string;
  likes: number;
  onPress: () => void;
  onLike: () => void;
}

const TransformationCard: React.FC<TransformationCardProps> = ({
  id,
  beforeImage,
  afterImage,
  title,
  description,
  providerName,
  likes,
  onPress,
  onLike,
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: beforeImage }} style={styles.image} />
          <Image source={{ uri: afterImage }} style={styles.image} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.provider}>by {providerName}</Text>
        </View>
        <TouchableOpacity style={styles.likeButton} onPress={onLike}>
          <Text style={styles.likeText}>❤️ {likes}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: '50%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  provider: {
    fontSize: 12,
    color: '#999',
  },
  likeButton: {
    alignSelf: 'flex-end',
  },
  likeText: {
    fontSize: 16,
  },
});

export default TransformationCard;