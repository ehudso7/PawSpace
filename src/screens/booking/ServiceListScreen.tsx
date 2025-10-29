import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Appbar, Chip, Searchbar, SegmentedButtons, Text, Button, Menu } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';
import { useInfiniteServices } from '../../hooks/useServices';
import { useDebouncedValue } from '../../hooks/useDebounce';
import { useUserLocation } from '../../hooks/useUserLocation';
import { ServiceCard } from '../../components/booking/ServiceCard';
import type { ServiceFilters } from '../../types/service';

type Props = NativeStackScreenProps<BookingStackParamList, 'ServiceList'>;

const SERVICE_TYPES = ['all', 'grooming', 'walking', 'vet_care', 'training'] as const;

type SortChoice = 'nearest' | 'price_asc' | 'rating' | 'popular';

function mapSort(choice: SortChoice): ServiceFilters['sort_by'] {
  switch (choice) {
    case 'nearest':
      return 'distance';
    case 'price_asc':
      return 'price';
    case 'rating':
      return 'rating';
    case 'popular':
      return 'popularity';
    default:
      return undefined;
  }
}

const ServiceListScreen: React.FC<Props> = ({ navigation }) => {
  // Search
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebouncedValue(query, 500);

  // Filters
  const [serviceType, setServiceType] = React.useState<(typeof SERVICE_TYPES)[number]>('all');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 200]);
  const [distance, setDistance] = React.useState<number>(50);
  const [availability, setAvailability] = React.useState<'today' | 'this_week' | 'anytime'>('anytime');
  const [sort, setSort] = React.useState<SortChoice>('nearest');

  const filters: ServiceFilters = React.useMemo(() => ({
    service_type: serviceType,
    min_price: priceRange[0],
    max_price: priceRange[1],
    max_distance: distance,
    availability_date: availability === 'anytime' ? undefined : availability,
    sort_by: mapSort(sort),
  }), [serviceType, priceRange, distance, availability, sort]);

  const { location } = useUserLocation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isRefetching, refetch, isLoading, error } = useInfiniteServices(filters, 12);

  const flatData = React.useMemo(() => (data?.pages || []).flat(), [data]);

  const onRefresh = React.useCallback(() => { refetch(); }, [refetch]);

  const renderItem = React.useCallback(({ item }: any) => (
    <ServiceCard
      service={item}
      userLocation={location || undefined}
      onPress={(svc) => navigation?.navigate?.('ProviderProfile', { id: svc.provider_id })}
      onBook={(svc) => navigation?.navigate?.('Booking', { id: svc.id })}
    />
  ), [location, navigation]);

  const keyExtractor = React.useCallback((item: any) => item.id, []);

  const ListEmpty = () => (
    <View style={styles.empty}> 
      {isLoading ? <Text>Loading...</Text> : <Text>No services found</Text>}
    </View>
  );

  const ListFooter = () => (
    <View style={{ paddingVertical: 16 }}>
      {isFetchingNextPage && <Text>Loading more...</Text>}
      {!hasNextPage && flatData.length > 0 && <Text style={{ textAlign: 'center', color: '#666' }}>You're all caught up</Text>}
    </View>
  );

  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Services" />
        <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={<Appbar.Action icon="sort" onPress={() => setMenuVisible(true)} />}>
          <Menu.Item title="Nearest" onPress={() => { setSort('nearest'); setMenuVisible(false); }} />
          <Menu.Item title="Price (Low-High)" onPress={() => { setSort('price_asc'); setMenuVisible(false); }} />
          <Menu.Item title="Top Rated" onPress={() => { setSort('rating'); setMenuVisible(false); }} />
          <Menu.Item title="Most Popular" onPress={() => { setSort('popular'); setMenuVisible(false); }} />
        </Menu>
      </Appbar.Header>

      <View style={styles.container}>
        {/* Search */}
        <Searchbar
          placeholder="Search by service or provider"
          value={query}
          onChangeText={setQuery}
          style={{ marginBottom: 8 }}
          onSubmitEditing={() => setQuery((q) => q)}
        />

        {/* Filter Chips */}
        <View style={styles.filtersRow}>
          <FlatList
            horizontal
            data={SERVICE_TYPES as unknown as string[]}
            keyExtractor={(t) => t}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            renderItem={({ item }) => (
              <Chip selected={serviceType === item} onPress={() => setServiceType(item as any)}>{item === 'all' ? 'All' : item.replace('_', ' ')}</Chip>
            )}
          />
        </View>

        {/* Secondary filters */}
        <View style={styles.quickFilters}>
          <SegmentedButtons
            value={availability}
            onValueChange={(v: any) => setAvailability(v)}
            buttons={[
              { value: 'today', label: 'Today' },
              { value: 'this_week', label: 'This Week' },
              { value: 'anytime', label: 'Anytime' },
            ]}
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip icon="cash" onPress={() => setPriceRange(([a, b]) => [a, b])}>{`$${priceRange[0]}-$${priceRange[1]}`}</Chip>
            <Chip icon="map-marker-distance" onPress={() => setDistance((d) => d)}>{`${distance} mi`}</Chip>
          </View>
        </View>

        {/* Results */}
        <FlatList
          data={flatData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          onEndReachedThreshold={0.3}
          onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          refreshControl={<RefreshControl refreshing={!!isRefetching} onRefresh={onRefresh} />}
        />
      </View>

      {error && (
        <View style={styles.errorToast}>
          <Text style={{ color: 'white' }}>{error.message}</Text>
          <Button onPress={() => refetch()}>Retry</Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  filtersRow: { 
    marginBottom: 8 
  },
  quickFilters: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  empty: { 
    padding: 24, 
    alignItems: 'center' 
  },
  errorToast: { 
    position: 'absolute', 
    bottom: 24, 
    left: 24, 
    right: 24, 
    backgroundColor: '#D32F2F', 
    borderRadius: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 12, 
    paddingVertical: 8 
  },
});

export default ServiceListScreen;
