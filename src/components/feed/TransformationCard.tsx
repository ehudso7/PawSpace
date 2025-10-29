import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import theme from '@/constants/theme';

interface TransformationCardProps {
  transformation: {
    imageUrl: string;
    caption: string;
    likesCount: number;
    user: { name: string; avatar?: string };
    createdAt?: string;
    isLiked?: boolean;
  };
  onPress?: () => void;
  onLike?: () => void;
  onShare?: () => void;
}

const TransformationCard: React.FC<TransformationCardProps> = ({ transformation, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          {transformation.user.avatar ? (
            <Image source={{ uri: transformation.user.avatar }} style={styles.avatar} />
          ) : null}
          <View style={styles.userInfo}>
            <Text style={styles.username}>{transformation.user.name}</Text>
            {transformation.createdAt ? <Text style={styles.timestamp}>{transformation.createdAt}</Text> : null}
          </View>
        </View>
        <Image source={{ uri: transformation.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.caption}>{transformation.caption}</Text>
          <Text style={styles.likes}>{transformation.likesCount} likes</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 16, padding: 0 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userInfo: { marginLeft: 12, flex: 1 },
  username: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  timestamp: { fontSize: 12, color: theme.colors.gray },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  content: { padding: 16 },
  caption: { fontSize: 14, color: theme.colors.text, marginBottom: 8 },
  likes: { fontSize: 12, color: theme.colors.gray },
});

export default TransformationCard;
