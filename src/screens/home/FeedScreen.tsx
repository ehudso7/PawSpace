import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
  Dimensions,
  ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { FeedHeader } from '../../components/feed/FeedHeader';
import { StoriesRow } from '../../components/feed/StoriesRow';
import { TransformationCard } from '../../components/feed/TransformationCard';
import { CreateButton } from '../../components/feed/CreateButton';
import { useFeed } from '../../hooks/useFeed';
import { Transformation, Story, FeedNavigationProps, UserProfile } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface FeedScreenProps {
  navigation: FeedNavigationProps;
  currentUser?: UserProfile;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({
  navigation,
  currentUser,
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const {
    transformations,
    stories,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    toggleLike,
    toggleSave,
    toggleFollow,
    updateFilter,
    search,
  } = useFeed({
    pageSize: 20,
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const isScrollingDownward = currentY > lastScrollY.value && currentY > 50;
      
      if (isScrollingDownward !== isScrollingDown) {
        runOnJS(setIsScrollingDown)(isScrollingDownward);
      }
      
      scrollY.value = currentY;
      lastScrollY.value = currentY;
    },
  });

  const onViewableItemsChanged = useCallback(({ viewableItems }: {
    viewableItems: ViewToken[];
  }) => {
    const visibleIds = new Set(
      viewableItems
        .filter(item => item.isViewable && item.item?.id)
        .map(item => item.item.id)
    );
    setVisibleItems(visibleIds);
  }, []);

  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 500,
  }), []);

  // Handlers
  const handleLike = useCallback((transformationId: string) => {
    toggleLike(transformationId);
  }, [toggleLike]);

  const handleSave = useCallback((transformationId: string) => {
    toggleSave(transformationId);
  }, [toggleSave]);

  const handleFollow = useCallback((userId: string) => {
    toggleFollow(userId);
  }, [toggleFollow]);

  const handleComment = useCallback((transformationId: string) => {
    navigation.navigate('TransformationDetail', { transformationId });
  }, [navigation]);

  const handleShare = useCallback((transformation: Transformation) => {
    // Share analytics could be tracked here
    console.log('Shared transformation:', transformation.id);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    navigation.navigate('Profile', { userId });
  }, [navigation]);

  const handleServicePress = useCallback((serviceId: string, providerId?: string) => {
    navigation.navigate('Booking', { 
      serviceTypeId: serviceId,
      providerId,
    });
  }, [navigation]);

  const handleMenuPress = useCallback((transformation: Transformation) => {
    // Handle report/menu actions
    console.log('Menu pressed for transformation:', transformation.id);
  }, []);

  const handleStoryPress = useCallback((story: Story, index: number) => {
    navigation.navigate('StoryViewer', { 
      stories: stories,
      initialIndex: index,
    });
  }, [navigation, stories]);

  const handleCreateStory = useCallback(() => {
    navigation.navigate('CreateStory');
  }, [navigation]);

  const handleCreateTransformation = useCallback(() => {
    navigation.navigate('ImageSelector');
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    navigation.navigate('FeedFilters', {
      onApplyFilters: (filters: any) => {
        updateFilter(filters);
        setHasActiveFilters(Object.keys(filters).length > 0);
      },
    });
  }, [navigation, updateFilter]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  const renderTransformation = useCallback(({ item, index }: {
    item: Transformation;
    index: number;
  }) => (
    <TransformationCard
      transformation={item}
      isVisible={visibleItems.has(item.id)}
      onLike={handleLike}
      onSave={handleSave}
      onFollow={handleFollow}
      onComment={handleComment}
      onShare={handleShare}
      onUserPress={handleUserPress}
      onServicePress={handleServicePress}
      onMenuPress={handleMenuPress}
      navigation={navigation}
    />
  ), [
    visibleItems,
    handleLike,
    handleSave,
    handleFollow,
    handleComment,
    handleShare,
    handleUserPress,
    handleServicePress,
    handleMenuPress,
    navigation,
  ]);

  const renderHeader = useCallback(() => (
    <StoriesRow
      stories={stories}
      currentUser={currentUser}
      onStoryPress={handleStoryPress}
      onCreateStory={handleCreateStory}
      style={styles.storiesContainer}
    />
  ), [stories, currentUser, handleStoryPress, handleCreateStory]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  }, [isLoadingMore]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>No transformations yet</Text>
        <Text style={styles.emptyStateSubtitle}>
          Follow some providers or check back later for new content!
        </Text>
      </View>
    );
  }, [isLoading]);

  const keyExtractor = useCallback((item: Transformation, index: number) => 
    `transformation-${item.id}-${index}`, []
  );

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: SCREEN_HEIGHT * 0.8, // Approximate item height
    offset: SCREEN_HEIGHT * 0.8 * index,
    index,
  }), []);

  if (error && transformations.length === 0) {
    return (
      <View style={styles.container}>
        <FeedHeader
          onSearchPress={handleSearchPress}
          onFilterPress={handleFilterPress}
          hasActiveFilters={hasActiveFilters}
        />
        <View style={styles.errorState}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FeedHeader
        onSearchPress={handleSearchPress}
        onFilterPress={handleFilterPress}
        hasActiveFilters={hasActiveFilters}
      />

      <AnimatedFlatList
        ref={flatListRef}
        data={transformations}
        renderItem={renderTransformation}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={3}
        windowSize={10}
        getItemLayout={getItemLayout}
        style={styles.feedList}
      />

      <CreateButton
        onPress={handleCreateTransformation}
        isScrollingDown={isScrollingDown}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedList: {
    flex: 1,
  },
  storiesContainer: {
    marginBottom: 8,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});