<<<<<<< HEAD
// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
=======
import { NavigatorScreenParams } from '@react-navigation/native';
>>>>>>> origin/main

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
<<<<<<< HEAD
  HomeTab: undefined;
  BookingTab: undefined;
  CreateTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Feed: undefined;
  TransformationDetail: { id: string };
};

export type BookingStackParamList = {
  ServiceList: undefined;
  ProviderProfile: { providerId: string };
  BookingCalendar: { serviceId: string; providerId: string };
  BookingConfirm: { bookingData: any };
  MyBookings: undefined;
};

export type CreateStackParamList = {
  ImageSelector: undefined;
  Editor: { imageUri: string };
  Preview: { beforeImage: string; afterImage: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
=======
  Feed: undefined;
  Services: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
  TransformationDetail: { transformationId: string };
  ProviderProfile: { providerId: string };
  BookingCalendar: { serviceId: string; providerId: string };
  BookingConfirm: { 
    serviceId: string; 
    providerId: string; 
    selectedDate: string; 
    selectedTime: string; 
  };
  ImageSelector: undefined;
  Editor: { images: string[] };
  Preview: { transformationId: string };
>>>>>>> origin/main
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
};
<<<<<<< HEAD
=======

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
>>>>>>> origin/main
