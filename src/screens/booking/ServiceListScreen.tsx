import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';
import { useServices } from '@/hooks/useBookings';
import { ServiceCard, Loading, ErrorMessage } from '@/components';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<BookingStackParamList, 'ServiceList'>;

const ServiceListScreen: React.FC<Props> = ({ navigation }) => {
  const { services, isLoading, error, fetchServices } = useServices();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const handleServicePress = (serviceId: string) => {
    // Navigate to provider profile or booking flow
    // This would typically navigate to a provider list or specific provider
    console.log('Service pressed:', serviceId);
  };

  const renderService = ({ item }: { item: any }) => (
    <ServiceCard
      service={item}
      onPress={() => handleServicePress(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Services Available</Text>
      <Text style={styles.emptyMessage}>
        Check back later for new pet care services in your area.
      </Text>
    </View>
  );

  if (isLoading && !refreshing) {
    return <Loading text="Loading services..." fullScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage message={error} />
        <Button
          title="Try Again"
          onPress={fetchServices}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pet Services</Text>
        <Text style={styles.subtitle}>Find the perfect care for your pet</Text>
      </View>

      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
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

export default ServiceListScreen;