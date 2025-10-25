import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import { feedService } from '../../services/feed';
import { Transformation, StoryGroup, ServiceType } from '../../types/feed';
import TransformationCard from '../../components/feed/TransformationCard';
import StoriesRow from '../../components/feed/StoriesRow';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeedScreenProps {
  navigation: any;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'following'>('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const scrollY = useSharedValue(0);
  const lastScrollY = useRef(0);
  const fabScale = useSharedValue(1);

  const services: ServiceType[] = [
    { id: '1', name: 'Grooming', icon: '✂️', color: '#FF6B6B' },
    { id: '2', name: 'Training', icon: '🎓', color: '#4ECDC4' },
    { id: '3', name: 'Veterinary', icon: '🏥', color: '#45B7D1' },
    { id: '4', name: 'Daycare', icon: '🏠', color: '#FFA07A' },
    { id: '5', name: 'Walking', icon: '🦮', color: '#98D8C8' },
  ];

  useEffect(() => {
    loadInitialData();
  }, [selectedFilter, selectedService]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [feedData, storiesData] = await Promise.all([
        loadFeed(1),
        feedService.getStories(),
      ]);

      setStories(storiesData);
      setTransformations(feedData.transformations);
      setHasMore(feedData.has_more);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeed = async (page: number) => {
    if (selectedService) {
      return await feedService.getFeedByService(selectedService, page);
    } else if (selectedFilter === 'following') {
      return await feedService.getFollowingFeed(page);
    } else {
      return await feedService.getFeed(page);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [feedData, storiesData] = await Promise.all([
        loadFeed(1),
        feedService.getStories(),
      ]);

      setStories(storiesData);
      setTransformations(feedData.transformations);
      setHasMore(feedData.has_more);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error refreshing feed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const feedData = await loadFeed(nextPage);

      setTransformations((prev) => [...prev, ...feedData.transformations]);
      setHasMore(feedData.has_more);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      loadInitialData();
      return;
    }

    try {
      const results = await feedService.searchTransformations(query);
      setTransformations(results);
      setHasMore(false);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleFilterChange = (filter: 'all' | 'following') => {
    setSelectedFilter(filter);
    setSelectedService(null);
    setFilterVisible(false);
  };

  const handleServiceFilter = (serviceId: string) => {
    setSelectedService(serviceId === selectedService ? null : serviceId);
    setSelectedFilter('all');
    setFilterVisible(false);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    scrollY.value = currentScrollY;

    // Hide/show FAB based on scroll direction
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      fabScale.value = withSpring(0);
    } else {
      fabScale.value = withSpring(1);
    }

    lastScrollY.current = currentScrollY;

    // Prefetch next page at 80%
    const scrollHeight = event.nativeEvent.contentSize.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const viewportHeight = event.nativeEvent.layoutMeasurement.height;

    if (scrollOffset + viewportHeight > scrollHeight * 0.8) {
      handleLoadMore();
    }
  };

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }],
      opacity: fabScale.value,
    };
  });

  const renderTransformationCard = useCallback(
    ({ item, index }: { item: Transformation; index: number }) => {
      return (
        <Animated.View
          entering={FadeIn.delay(index * 50)}
          key={item.id}
        >
          <TransformationCard
            transformation={item}
            onPress={() =>
              navigation.navigate('TransformationDetail', { transformationId: item.id })
            }
            onUserPress={(userId) =>
              navigation.navigate('Profile', { userId })
            }
            onServicePress={(serviceId) =>
              navigation.navigate('ServiceBooking', { serviceId })
            }
            onBookPress={(transformation) =>
              navigation.navigate('ServiceBooking', {
                providerId: transformation.user_id,
                serviceId: transformation.service_type.id,
              })
            }
            isVisible={true}
          />
        </Animated.View>
      );
    },
    [navigation]
  );

  const renderHeader = () => (
    <View>
      <StoriesRow
        stories={stories}
        onStoryPress={(storyGroup) =>
          navigation.navigate('StoryViewer', { storyGroup })
        }
        onCreateStory={() => navigation.navigate('CreateStory')}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={64} color="#CCC" />
        <Text style={styles.emptyText}>No transformations yet</Text>
        <Text style={styles.emptySubtext}>
          Follow users or search for transformations
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>PawSpace</Text>
        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSearchVisible(true)}
          >
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setFilterVisible(true)}
          >
            <Ionicons name="filter" size={24} color="#333" />
            {(selectedFilter === 'following' || selectedService) && (
              <View style={styles.filterBadge} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Feed */}
      <FlatList
        ref={flatListRef}
        data={transformations}
        renderItem={renderTransformationCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH + 200,
          offset: (SCREEN_WIDTH + 200) * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={10}
      />

      {/* Floating Create Button */}
      <Animated.View style={[styles.fab, fabAnimatedStyle]}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => navigation.navigate('ImageSelector')}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Search Modal */}
      <Modal
        visible={searchVisible}
        animationType="slide"
        onRequestClose={() => setSearchVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => setSearchVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search users, providers..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
          {/* Search results would go here */}
        </SafeAreaView>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterVisible(false)}
        >
          <Animated.View
            entering={SlideInUp}
            style={styles.filterSheet}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filter Feed</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Feed Type</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedFilter === 'all' && styles.filterChipActive,
                  ]}
                  onPress={() => handleFilterChange('all')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === 'all' && styles.filterChipTextActive,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedFilter === 'following' && styles.filterChipActive,
                  ]}
                  onPress={() => handleFilterChange('following')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === 'following' && styles.filterChipTextActive,
                    ]}
                  >
                    Following
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Service Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterOptions}
              >
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={[
                      styles.serviceChip,
                      selectedService === service.id && styles.serviceChipActive,
                      {
                        borderColor: service.color,
                        backgroundColor:
                          selectedService === service.id
                            ? service.color
                            : 'transparent',
                      },
                    ]}
                    onPress={() => handleServiceFilter(service.id)}
                  >
                    <Text style={styles.serviceEmoji}>{service.icon}</Text>
                    <Text
                      style={[
                        styles.serviceChipText,
                        selectedService === service.id && styles.serviceChipTextActive,
                      ]}
                    >
                      {service.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  feedContent: {
    paddingVertical: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingMore: {
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  filterSection: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#4A90E2',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterChipTextActive: {
    color: 'white',
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    gap: 6,
  },
  serviceChipActive: {
    borderWidth: 2,
  },
  serviceEmoji: {
    fontSize: 16,
  },
  serviceChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  serviceChipTextActive: {
    color: 'white',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FeedScreen;
