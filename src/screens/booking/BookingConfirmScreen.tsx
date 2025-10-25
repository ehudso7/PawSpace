import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingConfirm'>;

const BookingConfirmScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingData } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement booking confirmation with payment */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BookingConfirmScreen;