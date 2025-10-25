import React from 'react';
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
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress}>
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
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
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