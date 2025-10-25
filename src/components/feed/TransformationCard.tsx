import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/common';

interface TransformationCardProps {
  id: string;
  beforeImage: string;
  afterImage: string;
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
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
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
