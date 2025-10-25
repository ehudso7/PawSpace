import React from 'react';
<<<<<<< HEAD
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common';
import { theme } from '@/constants/theme';
import { Transformation } from '@/types';

interface TransformationCardProps {
  transformation: Transformation;
  onPress: () => void;
  onLike: () => void;
  onShare: () => void;
}

const TransformationCard: React.FC<TransformationCardProps> = ({
  transformation,
  onPress,
  onLike,
  onShare,
=======
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
>>>>>>> origin/main
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress}>
<<<<<<< HEAD
        <View style={styles.header}>
          <Image source={{ uri: transformation.user.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{transformation.user.name}</Text>
            <Text style={styles.timestamp}>{transformation.createdAt}</Text>
          </View>
        </View>
        
        <Image source={{ uri: transformation.imageUrl }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.caption}>{transformation.caption}</Text>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onLike}>
              <Ionicons
                name={transformation.isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={transformation.isLiked ? theme.colors.error : theme.colors.gray}
              />
              <Text style={styles.actionText}>{transformation.likesCount}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Ionicons name="share-outline" size={24} color={theme.colors.gray} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
=======
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
>>>>>>> origin/main
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
<<<<<<< HEAD
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.colors.gray,
  },
});

export default TransformationCard;
=======
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
>>>>>>> origin/main
