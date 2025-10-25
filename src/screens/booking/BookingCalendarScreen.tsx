import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingCalendar'>;

const BookingCalendarScreen: React.FC<Props> = ({ navigation, route }) => {
  const { serviceId, providerId } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement calendar with available time slots */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BookingCalendarScreen;