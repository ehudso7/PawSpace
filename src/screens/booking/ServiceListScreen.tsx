import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import { Searchbar, Menu, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ServiceCard } from '../../components/booking/ServiceCard';
import { FilterChips } from '../../components/booking/FilterChips';
import { LoadingSkeleton } from '../../components/booking/LoadingSkeleton';
import { useServices } from '../../hooks/useServices';
import { useLocation } from '../../hooks/useLocation';
import { useDebounce } from '../../hooks/useDebounce';
import { Service, ServiceFilters, ServiceType, SortOption, AvailabilityFilter } from '../../types/booking';

interface ServiceListScreenProps {
  navigation: any; // Replace with proper navigation type
}

export function ServiceListScreen({ navigation }: ServiceListScreenProps) {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityFilter>('anytime');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [maxDistance, setMaxDistance] = useState(50);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Location hook
  const { location, loading: locationLoading, requestPermission } = useLocation();

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Build filters object
  const filters: ServiceFilters = useMemo(() => ({
    service_type: selectedServiceType === 'all' ? undefined : selectedServiceType,
    min_price: priceRange.min > 0 ? priceRange.min : undefined,
    max_price: priceRange.max < 200 ? priceRange.max : undefined,
    max_distance: maxDistance < 50 ? maxDistance : undefined,
    search_query: debouncedSearchQuery || undefined,
    sort_by: sortBy,
  }), [selectedServiceType, priceRange, maxDistance, debouncedSearchQuery, sortBy]);

  // Services query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServices(filters, location || undefined);

  // Flatten paginated data
  const services = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.data);
  }, [data]);

  const handleServicePress = (service: Service) => {
    navigation.navigate('ProviderProfile', { 
      providerId: service.provider_id,
      serviceId: service.id 
    });
  };

  const handleBookPress = (service: Service) => {
    navigation.navigate('BookingFlow', { serviceId: service.id });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleLocationRequest = () => {
    Alert.alert(
      'Location Access',
      'Allow PawSpace to access your location to find nearby services?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Allow', onPress: requestPermission },
      ]
    );
  };

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'distance':
        return 'Nearest';
      case 'price':
        return 'Price (Low-High)';
      case 'rating':
        return 'Top Rated';
      case 'popularity':
        return 'Most Popular';
      default:
        return 'Sort';
    }
  };

  const renderService = ({ item }: { item: Service }) => (
    <ServiceCard
      service={item}
      onPress={() => handleServicePress(item)}
      onBookPress={() => handleBookPress(item)}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <LoadingSkeleton count={2} />;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No services found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or search terms
      </Text>
      <Button
        mode="outlined"
        onPress={() => {
          setSearchQuery('');
          setSelectedServiceType('all');
          setSelectedAvailability('anytime');
          setPriceRange({ min: 0, max: 200 });
          setMaxDistance(50);
        }}
        style={styles.clearFiltersButton}
      >
        Clear Filters
      </Button>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color="#FF5722" />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorSubtitle}>
        {error?.message || 'Failed to load services'}
      </Text>
      <Button mode="contained" onPress={handleRefresh} style={styles.retryButton}>
        Try Again
      </Button>
    </View>
  );

  if (isLoading && services.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Searchbar
            placeholder="Search services or providers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
        </View>
        <LoadingSkeleton count={5} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with search and sort */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search services or providers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.controlsRow}>
          <Menu
            visible={showSortMenu}
            onDismiss={() => setShowSortMenu(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowSortMenu(true)}
                icon="sort"
                style={styles.sortButton}
                contentStyle={styles.sortButtonContent}
              >
                {getSortLabel(sortBy)}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSortBy('distance');
                setShowSortMenu(false);
              }}
              title="Nearest"
              leadingIcon="map-marker"
            />
            <Menu.Item
              onPress={() => {
                setSortBy('price');
                setShowSortMenu(false);
              }}
              title="Price (Low-High)"
              leadingIcon="currency-usd"
            />
            <Menu.Item
              onPress={() => {
                setSortBy('rating');
                setShowSortMenu(false);
              }}
              title="Top Rated"
              leadingIcon="star"
            />
            <Menu.Item
              onPress={() => {
                setSortBy('popularity');
                setShowSortMenu(false);
              }}
              title="Most Popular"
              leadingIcon="trending-up"
            />
          </Menu>

          {!location && (
            <Button
              mode="text"
              onPress={handleLocationRequest}
              icon="map-marker-outline"
              style={styles.locationButton}
              labelStyle={styles.locationButtonLabel}
            >
              Enable Location
            </Button>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <FilterChips
        selectedServiceType={selectedServiceType}
        selectedAvailability={selectedAvailability}
        onServiceTypeChange={setSelectedServiceType}
        onAvailabilityChange={setSelectedAvailability}
      />

      <Divider />

      {/* Services List */}
      {isError ? (
        renderError()
      ) : services.length === 0 && !isLoading ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButton: {
    borderColor: '#E0E0E0',
  },
  sortButtonContent: {
    flexDirection: 'row-reverse',
  },
  locationButton: {
    marginLeft: 8,
  },
  locationButtonLabel: {
    fontSize: 12,
    color: '#2196F3',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearFiltersButton: {
    borderColor: '#2196F3',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2196F3',
  },
});