import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';
import { useTransformations } from '@/hooks/useTransformations';
import { TransformationCard, Loading, ErrorMessage } from '@/components';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Feed'>;

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const {
    transformations,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    loadMore,
    refresh,
    likeTransformation,
    unlikeTransformation,
  } = useTransformations();

  const handleTransformationPress = (transformationId: string) => {
    navigation.navigate('TransformationDetail', { id: transformationId });
  };

  const handleLike = async (transformationId: string) => {
    // Check if already liked (this would need to be tracked in the transformation data)
    // For now, just call the like function
    await likeTransformation(transformationId);
  };

  const handleShare = (transformationId: string) => {
    // Implement sharing functionality
    console.log('Share transformation:', transformationId);
  };

  const renderTransformation = ({ item }: { item: any }) => (
    <TransformationCard
      transformation={item}
      onPress={() => handleTransformationPress(item.id)}
      onLike={() => handleLike(item.id)}
      onShare={() => handleShare(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Transformations Yet</Text>
      <Text style={styles.emptyMessage}>
        Be the first to share your pet's amazing transformation!
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <Loading size="small" text="Loading more..." />
      </View>
    );
  };

  if (isLoading && !isRefreshing) {
    return <Loading text="Loading feed..." fullScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage message={error} />
        <Button
          title="Try Again"
          onPress={refresh}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PawSpace</Text>
        <Text style={styles.subtitle}>Amazing pet transformations</Text>
      </View>

      <FlatList
        data={transformations}
        renderItem={renderTransformation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fonts['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: theme.colors.textSecondary,
  },
  list: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fonts.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyMessage: {
    fontSize: theme.fonts.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
  },
});

export default FeedScreen;