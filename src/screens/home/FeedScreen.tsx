import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Feed'>;

interface Transformation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  beforeImageUrl?: string;
  caption: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [transformations, setTransformations] = useState<Transformation[]>([]);

  // TODO: Replace with actual API call
  const loadFeed = async () => {
    // Mock data
    setTransformations([]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Transformation }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {item.userAvatar ? (
            <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.caption}>{item.caption}</Text>
        {item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>#{tag} </Text>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>??</Text>
            <Text style={styles.actionText}>{item.likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>??</Text>
            <Text style={styles.actionText}>{item.commentsCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>??</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {transformations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>??</Text>
          <Text style={styles.emptyText}>No transformations yet</Text>
          <Text style={styles.emptySubtext}>Be the first to share a pet transformation!</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Create')}
          >
            <Text style={styles.createButtonText}>Create Transformation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transformations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>??</Text>
              <Text style={styles.emptyText}>Pull to refresh</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.lightGray,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.lightGray,
  },
  content: {
    padding: 12,
  },
  caption: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeedScreen;