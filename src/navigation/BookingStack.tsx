import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProviderProfileScreen from '../screens/booking/ProviderProfileScreen';
import BookingCalendarScreen from '../screens/booking/BookingCalendarScreen';
import BookingConfirmScreen from '../screens/booking/BookingConfirmScreen';

const Stack = createStackNavigator();

const BookingStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen
        name="ProviderProfile"
        component={ProviderProfileScreen}
        options={{
          title: 'Provider Profile',
        }}
      />
      <Stack.Screen
        name="BookingCalendar"
        component={BookingCalendarScreen}
        options={{
          title: 'Book Appointment',
        }}
      />
      <Stack.Screen
        name="BookingConfirm"
        component={BookingConfirmScreen}
        options={{
          title: 'Confirm Booking',
        }}
      />
    </Stack.Navigator>
  );
};

export default BookingStack;