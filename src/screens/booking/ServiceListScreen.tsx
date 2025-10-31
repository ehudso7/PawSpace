import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ServiceCard } from '@/components/booking';
import { Loading } from '@/components/common';
import { theme } from '@/constants/theme';
import { BookingStackParamList } from '@/types/navigation';
import { Service } from '@/types';

type Props = NativeStackScreenProps<BookingStackParamList, 'ServiceList'>;

const ServiceListScreen: React.FC<Props> = ({ navigation }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load services from API
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleServicePress = (service: Service) => {
    // TODO: Navigate to service detail
    console.log('Service selected:', service);
  };

  if (loading) {
    return <Loading fullScreen text="Loading services..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ServiceCard service={item} onPress={() => handleServicePress(item)} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No services available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#F5F5F5',
  },
  list: {
    padding: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.gray || '#999',
  },
});

export default ServiceListScreen;
