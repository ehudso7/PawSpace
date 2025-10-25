import React from 'react';
<<<<<<< HEAD
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/common';
=======
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Card from '@/components/common/Card';
>>>>>>> origin/main

interface TransformationCardProps {
  id: string;
  beforeImage: string;
  afterImage: string;
<<<<<<< HEAD
  likes: number;
  userName: string;
  onPress?: () => void;
}

const TransformationCard: React.FC<TransformationCardProps> = ({
  beforeImage,
  afterImage,
  likes,
  userName,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.imagesContainer}>
          <Image source={{ uri: beforeImage }} style={styles.image} />
          <Image source={{ uri: afterImage }} style={styles.image} />
        </View>
        <View style={styles.info}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.likes}>{likes} likes</Text>
        </View>
      </Card>
    </TouchableOpacity>
=======
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
>>>>>>> origin/main
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
<<<<<<< HEAD
  imagesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  image: {
    flex: 1,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  info: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  likes: {
    fontSize: 14,
    color: '#666',
  },
});

export default TransformationCard;
=======
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
>>>>>>> origin/main
