import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { useFocusEffect } from '@react-navigation/native';

import TransformationCard from '@/components/feed/TransformationCard';
import StoriesRow from '@/components/feed/StoriesRow';
import { Transformation, Story, UserProfile, ServiceType, FeedFilters } from '@/types';
import { feedService } from '@/services/feed';

const { width: screenWidth } = Dimensions.get('window');

const FeedScreen: React.FC = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FeedFilters>({});
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  const flatListRef = useRef<FlatList>(null);

  // Load initial data
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [feedData, storiesData, userData] = await Promise.all([
        feedService.getFeed(1, 20, filters),
        feedService.getStories(),
        getCurrentUser(), // This would come from your auth service
      ]);

      setTransformations(feedData.transformations);
      setStories(storiesData);
      setCurrentUser(userData);
      setHasMore(feedData.has_more);
      setCurrentPage(1);
    } catch (error) {
      Alert.alert('Error', 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = async (): Promise<UserProfile> => {
    // This would typically come from your auth service
    return {
      id: 'current-user-id',
      username: 'currentuser',
      display_name: 'Current User',
      avatar_url: 'https://via.placeholder.com/150',
      bio: 'Bio here',
      followers_count: 100,
      following_count: 50,
      is_following: false,
      is_verified: false,
      created_at: new Date().toISOString(),
    };
  };

  const loadMoreData = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const feedData = await feedService.getFeed(nextPage, 20, filters);

      setTransformations(prev => [...prev, ...feedData.transformations]);
      setHasMore(feedData.has_more);
      setCurrentPage(nextPage);
    } catch (error) {
      Alert.alert('Error', 'Failed to load more content');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      await loadInitialData();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await feedService.searchTransformations(query);
      setTransformations(searchResults.transformations);
      setHasMore(false);
    } catch (error) {
      Alert.alert('Error', 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters: FeedFilters) => {
    setFilters(newFilters);
    setLoading(true);
    
    try {
      const feedData = await feedService.getFeed(1, 20, newFilters);
      setTransformations(feedData.transformations);
      setHasMore(feedData.has_more);
      setCurrentPage(1);
    } catch (error) {
      Alert.alert('Error', 'Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = useCallback((id: string, isLiked: boolean) => {
    setTransformations(prev =>
      prev.map(transformation =>
        transformation.id === id
          ? {
              ...transformation,
              is_liked: isLiked,
              likes_count: isLiked
                ? transformation.likes_count + 1
                : transformation.likes_count - 1,
            }
          : transformation
      )
    );
  }, []);

  const handleSave = useCallback((id: string, isSaved: boolean) => {
    setTransformations(prev =>
      prev.map(transformation =>
        transformation.id === id
          ? { ...transformation, is_saved: isSaved }
          : transformation
      )
    );
  }, []);

  const handleComment = useCallback((transformation: Transformation) => {
    // Navigate to transformation detail screen
    // navigation.navigate('TransformationDetail', { transformation });
  }, []);

  const handleUserPress = useCallback((user: UserProfile) => {
    // Navigate to user profile
    // navigation.navigate('Profile', { userId: user.id });
  }, []);

  const handleServicePress = useCallback((serviceId: string) => {
    // Navigate to booking screen
    // navigation.navigate('Booking', { serviceId });
  }, []);

  const handleReport = useCallback((transformation: Transformation) => {
    Alert.alert(
      'Report Content',
      'Why are you reporting this content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Spam', onPress: () => reportTransformation(transformation.id, 'spam') },
        { text: 'Inappropriate', onPress: () => reportTransformation(transformation.id, 'inappropriate') },
        { text: 'Other', onPress: () => reportTransformation(transformation.id, 'other') },
      ]
    );
  }, []);

  const reportTransformation = async (id: string, reason: string) => {
    try {
      await feedService.reportTransformation(id, reason);
      Alert.alert('Success', 'Content reported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to report content');
    }
  };

  const handleShare = useCallback(async (transformation: Transformation) => {
    try {
      await Share.share({
        message: `Check out this amazing transformation! ${transformation.caption}`,
        url: `https://app.com/transformation/${transformation.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
    }
  }, []);

  const handleStoryPress = useCallback((story: Story) => {
    // Navigate to story viewer
    // navigation.navigate('StoryViewer', { story });
  }, []);

  const handleAddStory = useCallback(() => {
    // Navigate to story creation
    // navigation.navigate('CreateStory');
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.logo}>Transform</Text>
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter-list" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transformations, users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery('');
              handleSearch('');
            }}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterChip, !filters.service_type && styles.activeFilterChip]}
          onPress={() => handleFilterChange({ ...filters, service_type: undefined })}
        >
          <Text style={[styles.filterText, !filters.service_type && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        
        {serviceTypes.map(service => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.filterChip,
              filters.service_type === service.id && styles.activeFilterChip,
            ]}
            onPress={() => handleFilterChange({ ...filters, service_type: service.id })}
          >
            <Text
              style={[
                styles.filterText,
                filters.service_type === service.id && styles.activeFilterText,
              ]}
            >
              {service.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStories = () => {
    if (!currentUser) return null;
    
    return (
      <StoriesRow
        stories={stories}
        currentUser={currentUser}
        onStoryPress={handleStoryPress}
        onAddStory={handleAddStory}
      />
    );
  };

  const renderTransformationCard = ({ item }: { item: Transformation }) => (
    <TransformationCard
      transformation={item}
      onLike={handleLike}
      onSave={handleSave}
      onComment={handleComment}
      onUserPress={handleUserPress}
      onServicePress={handleServicePress}
      onReport={handleReport}
      onShare={handleShare}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="photo-library" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No transformations yet</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to share an amazing transformation!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {showSearch && renderSearchBar()}
      {showFilters && renderFilters()}
      
      {renderStories()}
      
      <FlatList
        ref={flatListRef}
        data={transformations}
        renderItem={renderTransformationCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.8}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
      />
      
      {/* Floating Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          // Navigate to image selector
          // navigation.navigate('ImageSelector');
        }}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  activeFilterChip: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  feedContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default FeedScreen;