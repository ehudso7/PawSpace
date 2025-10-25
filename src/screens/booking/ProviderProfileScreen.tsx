import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'ProviderProfile'>;

const ProviderProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { providerId } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement provider profile with services and reviews */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ProviderProfileScreen;