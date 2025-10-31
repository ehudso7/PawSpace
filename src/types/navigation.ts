import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Service, ProviderProfile, Booking} from './booking';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  ServiceList: undefined;
  ServiceDetail: {service: Service; provider: ProviderProfile};
  BookingConfirm: {
    service: Service;
    provider: ProviderProfile;
    appointmentTime: string;
  };
  BookingSuccess: {booking: Booking};
  MyBookings: undefined;
  BookingDetail: {bookingId: string};
};

export type TabParamList = {
  HomeTab: undefined;
  ServicesTab: undefined;
  BookingsTab: undefined;
  ProfileTab: undefined;
};

export type BookingConfirmScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookingConfirm'
>;

export type BookingConfirmScreenRouteProp = RouteProp<
  RootStackParamList,
  'BookingConfirm'
>;

export type BookingSuccessScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookingSuccess'
>;

export type BookingSuccessScreenRouteProp = RouteProp<
  RootStackParamList,
  'BookingSuccess'
>;

export type MyBookingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MyBookings'
>;

export type BookingDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookingDetail'
>;

export type BookingDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'BookingDetail'
>;