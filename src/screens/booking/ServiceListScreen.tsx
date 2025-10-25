import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Searchbar,
  Chip,
  Menu,
  Button,
  Text,
  Portal,
  Modal,
  Divider,
  useTheme,
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Service, ServiceFilters, Location as LocationType } from '../../types/booking';
import { getServices, searchServices, clearServiceCache } from '../../services/bookings';
import { ServiceCard } from '../../components/booking/ServiceCard';
import { ServiceCardSkeleton } from '../../components/booking/ServiceCardSkeleton';
import { useDebouncedValue } from '../../utils/debounce';

const SERVICE_TYPES = ['All', 'Grooming', 'Walking', 'Vet Care', 'Training'];
const AVAILABILITY_OPTIONS = ['Anytime', 'Today', 'This Week'];
const SORT_OPTIONS = [
  { label: 'Nearest', value: 'distance' },
  { label: 'Price (Low-High)', value: 'price' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popularity' },
];

export const ServiceListScreen: React.FC = () => {
  const theme = useTheme();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
  const [services, setServices] = useState<(Service & { distance?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<ServiceFilters>({
    service_type: 'All',
    min_price: 0,
    max_price: 200,
    max_distance: 50,
    sort_by: 'distance',
  });
  const [selectedAvailability, setSelectedAvailability] = useState('Anytime');
  
  // UI state
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [distanceRange, setDistanceRange] = useState(50);

  const flatListRef = useRef<FlatList>(null);

  // Request location permissions and get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError('Failed to get location');
      }
    })();
  }, []);

  // Fetch services when filters or location change
  useEffect(() => {
    if (debouncedSearchQuery) {
      handleSearch();
    } else {
      fetchServices(true);
    }
  }, [debouncedSearchQuery, filters, userLocation]);

  const fetchServices = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      const currentPage = reset ? 1 : page;
      const response = await getServices(
        filters,
        currentPage,
        20,
        userLocation || undefined
      );

      if (reset) {
        setServices(response.data);
      } else {
        setServices((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.has_more);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchServices(
        debouncedSearchQuery,
        userLocation || undefined
      );
      setServices(results);
      setHasMore(false);
      setLoading(false);
    } catch (error) {
      console.error('Error searching services:', error);
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    clearServiceCache();
    fetchServices(true);
  }, [filters, userLocation]);

  const handleLoadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
      fetchServices(false);
    }
  };

  const handleServiceTypePress = (type: string) => {
    setFilters((prev) => ({ ...prev, service_type: type }));
  };

  const handleAvailabilityPress = (option: string) => {
    setSelectedAvailability(option);
    let availabilityDate: string | undefined;

    if (option === 'Today') {
      availabilityDate = new Date().toISOString().split('T')[0];
    } else if (option === 'This Week') {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      availabilityDate = nextWeek.toISOString().split('T')[0];
    }

    setFilters((prev) => ({ ...prev, availability_date: availabilityDate }));
  };

  const handleSortChange = (sortValue: string) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: sortValue as ServiceFilters['sort_by'],
    }));
    setSortMenuVisible(false);
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      min_price: priceRange[0],
      max_price: priceRange[1],
      max_distance: distanceRange,
    }));
    setFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 200]);
    setDistanceRange(50);
    setFilters({
      service_type: 'All',
      min_price: 0,
      max_price: 200,
      max_distance: 50,
      sort_by: 'distance',
    });
    setSelectedAvailability('Anytime');
    setFilterModalVisible(false);
  };

  const renderServiceCard = ({ item, index }: { item: Service & { distance?: number }; index: number }) => (
    <ServiceCard service={item} distance={item.distance} index={index} />
  );

  const renderSkeleton = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <ServiceCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );

  const renderEmpty = () => (
    <Animated.View entering={FadeIn} style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🐾</Text>
      <Text style={styles.emptyTitle}>No Services Found</Text>
      <Text style={styles.emptyText}>
        Try adjusting your filters or search criteria
      </Text>
      <Button mode="contained" onPress={handleResetFilters} style={styles.emptyButton}>
        Reset Filters
      </Button>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search services or providers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />

      {/* Service Type Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {SERVICE_TYPES.map((type) => (
          <Chip
            key={type}
            selected={filters.service_type === type}
            onPress={() => handleServiceTypePress(type)}
            style={styles.chip}
            selectedColor={theme.colors.primary}
            mode={filters.service_type === type ? 'flat' : 'outlined'}
          >
            {type}
          </Chip>
        ))}
      </ScrollView>

      {/* Availability Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {AVAILABILITY_OPTIONS.map((option) => (
          <Chip
            key={option}
            selected={selectedAvailability === option}
            onPress={() => handleAvailabilityPress(option)}
            style={styles.chip}
            selectedColor={theme.colors.primary}
            mode={selectedAvailability === option ? 'flat' : 'outlined'}
            icon={selectedAvailability === option ? 'check' : undefined}
          >
            {option}
          </Chip>
        ))}
      </ScrollView>

      {/* Sort and Filter Bar */}
      <View style={styles.controlBar}>
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setSortMenuVisible(true)}
              icon="sort"
              style={styles.controlButton}
            >
              {SORT_OPTIONS.find((opt) => opt.value === filters.sort_by)?.label ||
                'Sort'}
            </Button>
          }
        >
          {SORT_OPTIONS.map((option) => (
            <Menu.Item
              key={option.value}
              onPress={() => handleSortChange(option.value)}
              title={option.label}
              leadingIcon={
                filters.sort_by === option.value ? 'check' : undefined
              }
            />
          ))}
        </Menu>

        <Button
          mode="outlined"
          onPress={() => setFilterModalVisible(true)}
          icon="filter"
          style={styles.controlButton}
        >
          Filters
        </Button>
      </View>

      {locationError && (
        <View style={styles.locationError}>
          <Text style={styles.locationErrorText}>⚠️ {locationError}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        ref={flatListRef}
        data={services}
        renderItem={renderServiceCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={loading && services.length === 0 ? styles.loadingContainer : undefined}
      />

      {loading && services.length === 0 && renderSkeleton()}

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Filters</Text>
          <Divider style={styles.divider} />

          {/* Price Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>$0</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={200}
                step={10}
                value={priceRange[0]}
                onValueChange={(value) => setPriceRange([value, priceRange[1]])}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor="#E0E0E0"
              />
              <Text style={styles.sliderValue}>$200</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>$0</Text>
              <Slider
                style={styles.slider}
                minimumValue={priceRange[0]}
                maximumValue={200}
                step={10}
                value={priceRange[1]}
                onValueChange={(value) => setPriceRange([priceRange[0], value])}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor="#E0E0E0"
              />
              <Text style={styles.sliderValue}>$200</Text>
            </View>
          </View>

          {/* Distance Range */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>
              Distance: {distanceRange} miles
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>0 mi</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={50}
                step={5}
                value={distanceRange}
                onValueChange={setDistanceRange}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor="#E0E0E0"
              />
              <Text style={styles.sliderValue}>50 mi</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={handleResetFilters}
              style={styles.modalButton}
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={handleApplyFilters}
              style={styles.modalButton}
            >
              Apply
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    elevation: 2,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
  controlBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  controlButton: {
    flex: 1,
  },
  locationError: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  locationErrorText: {
    color: '#E65100',
    fontSize: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  filterSection: {
    marginVertical: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  sliderValue: {
    fontSize: 12,
    color: '#666666',
    width: 40,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
