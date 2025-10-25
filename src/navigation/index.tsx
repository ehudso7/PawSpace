import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BookingConfirmScreen from '../screens/booking/BookingConfirmScreen';
import BookingSuccessScreen from '../screens/booking/BookingSuccessScreen';
import MyBookingsScreen from '../screens/booking/MyBookingsScreen';
import BookingDetailScreen from '../screens/booking/BookingDetailScreen';
import StripeProviderWrapper from '../config/StripeProviderWrapper';
import AddPetScreen from '../screens/pets/AddPetScreen';
import PaymentMethodsScreen from '../screens/payment/PaymentMethodsScreen';
import ServiceListScreen from '../screens/services/ServiceListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import LeaveReviewScreen from '../screens/reviews/LeaveReviewScreen';
import CancelBookingScreen from '../screens/booking/CancelBookingScreen';

const Stack = createStackNavigator();

export default function AppNavigator(): JSX.Element {
  return (
    <StripeProviderWrapper>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
          <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
          <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
          <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
          <Stack.Screen name="AddPet" component={AddPetScreen} />
          <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
          <Stack.Screen name="ServiceList" component={ServiceListScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="LeaveReview" component={LeaveReviewScreen} />
          <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProviderWrapper>
  );
}
