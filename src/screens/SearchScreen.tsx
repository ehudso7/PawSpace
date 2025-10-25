import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransformationCard } from '../components/feed/TransformationCard';
import { FastImage } from '../components/common/FastImage';
import { feedService } from '../services/feed';
import { 
  SearchResult, 
  Transformation, 
  UserProfile, 
  ServiceType,
  FeedNavigationProps 
} from '../types';

interface SearchScreenProps {
  navigation: FeedNavigationProps;
  currentUser?: UserProfile;
}

type SearchTab = 'all' | 'transformations' | 'users' | 'services';

export const SearchScreen: React.FC<SearchScreenProps> = ({
  navigation,
  currentUser,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([
    'hair transformation',
    'skincare routine',
    'nail art',
    'makeup tutorial',
    'fitness journey',
  ]);

  const inputRef = useRef<TextInput>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Focus input when screen loads
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    try {
      setIsLoading(true);
      const searchResults = await feedService.searchAll(searchQuery.trim());
      setResults(searchResults);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)];
        return updated.slice(0, 10); // Keep only 10 recent searches
      });
    } catch (error) {
      console.error('Search failed:', error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    
    // Debounce search
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      performSearch(text);
    }, 300);
  }, [performSearch]);

  const handleRecentSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  }, [performSearch]);

  const handleTrendingTopic = useCallback((topic: string) => {
    setQuery(topic);
    performSearch(topic);
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(null);
    inputRef.current?.focus();
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

  const handleTransformationPress = useCallback((transformation: Transformation) => {
    navigation.navigate('TransformationDetail', { 
      transformationId: transformation.id,
      transformation,
    });
  }, [navigation]);

  const renderTransformation = useCallback(({ item }: { item: Transformation }) => (
    <TransformationCard
      transformation={item}
      isVisible={true}
      onLike={() => {}}
      onSave={() => {}}
      onFollow={() => {}}
      onComment={() => handleTransformationPress(item)}
      onShare={() => {}}
      onUserPress={handleUserPress}
      onServicePress={handleServicePress}
      onMenuPress={() => {}}
      navigation={navigation}
    />
  ), [handleTransformationPress, handleUserPress, handleServicePress, navigation]);

  const renderUser = useCallback(({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item.id)}
      activeOpacity={0.7}
    >
      <FastImage
        source={{
          uri: item.avatar_url || 'https://via.placeholder.com/50',
          priority: 'normal'
        }}
        style={styles.userAvatar}
      />
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userDisplayName}>
            {item.display_name || item.username}
          </Text>
          {item.is_verified && (
            <Text style={styles.verifiedIcon}>✓</Text>
          )}
          {item.is_provider && (
            <View style={styles.providerBadge}>
              <Text style={styles.providerBadgeText}>PRO</Text>
            </View>
          )}
        </View>
        <Text style={styles.userUsername}>@{item.username}</Text>
        <Text style={styles.userStats}>
          {item.follower_count} followers
        </Text>
      </View>
    </TouchableOpacity>
  ), [handleUserPress]);

  const renderService = useCallback(({ item }: { item: ServiceType }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServicePress(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.serviceIcon, { backgroundColor: item.color || '#007AFF' }]}>
        <Text style={styles.serviceIconText}>
          {item.icon || item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  ), [handleServicePress]);

  const renderRecentSearch = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearch(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.recentSearchIcon}>🕐</Text>
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  ), [handleRecentSearch]);

  const renderTrendingTopic = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.trendingTopicItem}
      onPress={() => handleTrendingTopic(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.trendingTopicIcon}>🔥</Text>
      <Text style={styles.trendingTopicText}>{item}</Text>
    </TouchableOpacity>
  ), [handleTrendingTopic]);

  const getFilteredResults = () => {
    if (!results) return [];
    
    switch (activeTab) {
      case 'transformations':
        return results.transformations;
      case 'users':
        return results.users;
      case 'services':
        return results.services;
      default:
        return [
          ...results.transformations,
          ...results.users,
          ...results.services,
        ];
    }
  };

  const renderSearchResults = () => {
    const filteredResults = getFilteredResults();
    
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (!results || filteredResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching for users, transformations, or services
          </Text>
        </View>
      );
    }

    if (activeTab === 'transformations' || activeTab === 'all') {
      return (
        <FlatList
          data={activeTab === 'all' ? results.transformations : filteredResults}
          renderItem={renderTransformation}
          keyExtractor={(item) => `transformation-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      );
    }

    if (activeTab === 'users') {
      return (
        <FlatList
          data={results.users}
          renderItem={renderUser}
          keyExtractor={(item) => `user-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      );
    }

    if (activeTab === 'services') {
      return (
        <FlatList
          data={results.services}
          renderItem={renderService}
          keyExtractor={(item) => `service-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      );
    }

    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <FlatList
            data={recentSearches}
            renderItem={renderRecentSearch}
            keyExtractor={(item, index) => `recent-${index}`}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending</Text>
        <FlatList
          data={trendingTopics}
          renderItem={renderTrendingTopic}
          keyExtractor={(item, index) => `trending-${index}`}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={query}
            onChangeText={handleQueryChange}
            placeholder="Search transformations, users, services..."
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={() => performSearch(query)}
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSearch}
              activeOpacity={0.7}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      {results && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All ({results.total_count})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transformations' && styles.activeTab]}
            onPress={() => setActiveTab('transformations')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'transformations' && styles.activeTabText]}>
              Posts ({results.transformations.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'users' && styles.activeTab]}
            onPress={() => setActiveTab('users')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
              Users ({results.users.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'services' && styles.activeTab]}
            onPress={() => setActiveTab('services')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
              Services ({results.services.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {query.trim() && results ? renderSearchResults() : renderEmptyState()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: '#666',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  resultsList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyStateContainer: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDisplayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#1DA1F2',
    marginLeft: 4,
  },
  providerBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  providerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userStats: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  serviceCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentSearchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#000',
  },
  trendingTopicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  trendingTopicIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  trendingTopicText: {
    fontSize: 16,
    color: '#000',
  },
});