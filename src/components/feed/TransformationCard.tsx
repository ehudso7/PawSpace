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
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.header}>
          <Image source={{ uri: transformation.user?.avatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{transformation.user?.name || 'User'}</Text>
            <Text style={styles.timestamp}>{transformation.createdAt}</Text>
          </View>
        </View>
        
        <Image source={{ uri: transformation.imageUrl }} style={styles.image} />
        
        <View style={styles.content}>
          {transformation.caption && (
            <Text style={styles.caption}>{transformation.caption}</Text>
          )}
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onLike}>
              <Ionicons
                name={transformation.isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={transformation.isLiked ? (theme.colors.error || '#FF3B30') : (theme.colors.gray || '#999')}
              />
              <Text style={styles.actionText}>{transformation.likesCount || 0}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
              <Ionicons name="share-outline" size={24} color={theme.colors.gray || '#999'} />
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
    overflow: 'hidden',
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
    backgroundColor: theme.colors.gray || '#DDD',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text || '#333',
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.gray || '#999',
    marginTop: 2,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    backgroundColor: theme.colors.gray || '#EEE',
  },
  content: {
    padding: 16,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.text || '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.gray || '#666',
  },
});

export default TransformationCard;
