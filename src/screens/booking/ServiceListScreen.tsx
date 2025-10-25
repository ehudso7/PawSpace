import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { Appbar, ActivityIndicator, Chip, SegmentedButtons, Searchbar, Text, HelperText, Menu, Button, Divider } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation';
import { useQuery } from '@tanstack/react-query';
import { Service, ServiceFilters } from '@/types/booking';
import { getServices, searchServices } from '@/services/bookings';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { getDistanceMiles } from '@/utils/location';
import { ServiceCard } from '@/components/booking/ServiceCard';

const PAGE_SIZE = 10;

const serviceTypes = [
  { label: 'All', value: '' },
  { label: 'Grooming', value: 'grooming' },
  { label: 'Walking', value: 'walking' },
  { label: 'Vet Care', value: 'vet_care' },
  { label: 'Training', value: 'training' },
];

const availabilityOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'Anytime', value: 'any' },
];

const sortOptions = [
  { label: 'Nearest', value: 'distance' },
  { label: 'Price (Low-High)', value: 'price' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popularity' },
];

export default function ServiceListScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 500);

  const [selectedType, setSelectedType] = useState('');
  const [maxPrice, setMaxPrice] = useState(200);
  const [maxDistance, setMaxDistance] = useState(50);
  const [availability, setAvailability] = useState<'today' | 'week' | 'any'>('any');
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating' | 'popularity'>('distance');

  const { coords, loading: locationLoading, error: locationError } = useCurrentLocation();

  const filters: ServiceFilters = useMemo(() => {
    let availability_date: string | undefined = undefined;
    if (availability === 'today') {
      availability_date = new Date().toISOString().slice(0, 10);
    } else if (availability === 'week') {
      // We'll fetch all and allow UI filter by next 7 days (mock data already contains many)
      availability_date = undefined;
    }
    return {
      service_type: selectedType || undefined,
      max_price: maxPrice,
      min_price: 0,
      max_distance: maxDistance,
      availability_date,
      sort_by: sortBy,
    };
  }, [selectedType, maxPrice, maxDistance, availability, sortBy]);

  const { data, isFetching, refetch, isRefetching, error } = useQuery({
    queryKey: ['services', filters, debouncedQuery, coords?.latitude ?? null, coords?.longitude ?? null],
    queryFn: async (): Promise<Service[]> => {
      const base = debouncedQuery.trim()
        ? await searchServices(debouncedQuery.trim())
        : await getServices(filters);
      // Client-side refinements for mock layer: price cap + week availability
      const now = new Date();
      const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      let refined = base.filter((s) => {
        const typeOk = !selectedType || s.service_type === (selectedType as any);
        const priceOk = s.price <= maxPrice;
        const weekOk = availability !== 'week' ? true : s.availability_slots.some((slot) => {
          if (!slot.is_available) return false;
          const d = new Date(slot.date);
          return d >= now && d <= weekAhead;
        });
        const distanceOk = coords && maxDistance >= 0
          ? getDistanceMiles(coords, s.location) <= maxDistance
          : true;
        return typeOk && priceOk && weekOk && distanceOk;
      });
      // Sorting
      refined = [...refined].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return a.price - b.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popularity':
            return b.total_bookings - a.total_bookings;
          case 'distance':
            if (!coords) return 0;
            return getDistanceMiles(coords, a.location) - getDistanceMiles(coords, b.location);
          default:
            return 0;
        }
      });
      return refined;
    },
  });

  const [page, setPage] = useState(1);
  const items = data ?? [];
  const pagedItems = items.slice(0, page * PAGE_SIZE);
  const canLoadMore = pagedItems.length < items.length;

  useEffect(() => {
    // Reset pagination when filters or query change
    setPage(1);
  }, [debouncedQuery, selectedType, maxPrice, maxDistance, availability, sortBy]);

  const onEndReached = useCallback(() => {
    if (!isFetching && canLoadMore) {
      setPage((p) => p + 1);
    }
  }, [isFetching, canLoadMore]);

  const onRefresh = useCallback(async () => {
    setPage(1);
    await refetch();
  }, [refetch]);

  const renderItem = useCallback(({ item }: { item: Service }) => {
    const distance = coords ? getDistanceMiles(coords, item.location) : null;
    return (
      <ServiceCard
        service={item}
        distanceMiles={distance}
        onPress={() => navigation.navigate('ProviderProfile', { service: item })}
        onBook={() => navigation.navigate('ProviderProfile', { service: item })}
      />
    );
  }, [coords, navigation]);

  function ListHeaderContent() {
    return (
    <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
      <Searchbar
        placeholder="Search services or providers"
        value={query}
        onChangeText={setQuery}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {serviceTypes.map((t) => (
          <Chip
            key={t.value}
            compact
            selected={selectedType === t.value}
            onPress={() => setSelectedType(t.value)}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            {t.label}
          </Chip>
        ))}
      </View>
      {/* Sliders could be added with @react-native-community/slider; placeholder bars shown here */}
      <View style={{ marginTop: 4 }}>
        <Text variant="labelLarge">Max Price: ${maxPrice}</Text>
        <Slider
          minimumValue={0}
          maximumValue={200}
          step={5}
          value={maxPrice}
          onValueChange={setMaxPrice}
          minimumTrackTintColor="#6200ee"
        />
      </View>
      <View style={{ marginTop: 8 }}>
        <Text variant="labelLarge">Max Distance: {maxDistance} mi</Text>
        <Slider
          minimumValue={0}
          maximumValue={50}
          step={1}
          value={maxDistance}
          onValueChange={setMaxDistance}
          minimumTrackTintColor="#6200ee"
        />
      </View>
      <SegmentedButtons
        value={availability}
        onValueChange={(v) => setAvailability(v as any)}
        buttons={availabilityOptions}
        style={{ marginTop: 8 }}
      />
      <SortMenu sortBy={sortBy} setSortBy={setSortBy} />
      {!!locationError && (
        <HelperText type="error">Location unavailable. Distance and nearest sort may be inaccurate.</HelperText>
      )}
      {!!error && !isFetching && (
        <HelperText type="error">Failed to load services. Pull to refresh to retry.</HelperText>
      )}
    </View>
    );
  }

  const ListEmpty = (
    <View style={{ alignItems: 'center', padding: 24 }}>
      {isFetching ? (
        <ActivityIndicator />
      ) : (
        <Text>No services found. Try adjusting filters.</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Find Services" />
      </Appbar.Header>
      {isFetching && items.length === 0 ? (
        <View style={{ padding: 16 }}>
          <ListHeaderContent />
          <SkeletonList count={6} />
        </View>
      ) : (
        <FlatList
          data={pagedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={ListHeaderContent}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

function SortMenu({ sortBy, setSortBy }: { sortBy: 'distance' | 'price' | 'rating' | 'popularity'; setSortBy: (v: any) => void }) {
  const [visible, setVisible] = useState(false);
  const label = sortOptions.find((s) => s.value === sortBy)?.label ?? 'Sort';
  return (
    <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={<Button mode="outlined" onPress={() => setVisible(true)}>Sort: {label}</Button>}
      >
        {sortOptions.map((s, idx) => (
          <React.Fragment key={s.value}>
            <Menu.Item
              onPress={() => {
                setSortBy(s.value);
                setVisible(false);
              }}
              title={s.label}
              leadingIcon={sortBy === (s.value as any) ? 'check' : undefined}
            />
            {idx < sortOptions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Menu>
    </View>
  );
}

function SkeletonList({ count = 6 }: { count?: number }) {
  const items = new Array(count).fill(0);
  return (
    <View>
      {items.map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </View>
  );
}

import { Animated } from 'react-native';
function SkeletonCard() {
  const opacity = React.useRef(new Animated.Value(0.6)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={{ marginVertical: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: 'white', padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Animated.View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#e0e0e0', opacity }} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Animated.View style={{ height: 16, borderRadius: 4, backgroundColor: '#e0e0e0', opacity, width: '60%' }} />
          <Animated.View style={{ height: 12, borderRadius: 4, backgroundColor: '#e0e0e0', opacity, width: '40%', marginTop: 8 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Animated.View style={{ height: 24, borderRadius: 12, backgroundColor: '#e0e0e0', opacity, width: 80, marginRight: 8 }} />
            <Animated.View style={{ height: 14, borderRadius: 4, backgroundColor: '#e0e0e0', opacity, width: 120 }} />
          </View>
        </View>
        <Animated.View style={{ width: 88, height: 36, borderRadius: 18, backgroundColor: '#e0e0e0', opacity, marginLeft: 8 }} />
      </View>
      <Animated.View style={{ height: 180, borderRadius: 8, backgroundColor: '#e0e0e0', opacity, marginTop: 12 }} />
    </View>
  );
}
