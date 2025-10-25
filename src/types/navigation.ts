import { NavigatorScreenParams } from '@react-navigation/native';
import { Service, ProviderProfile } from './booking';

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// Tab Navigator
export type TabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Booking: NavigatorScreenParams<BookingStackParamList>;
  Create: NavigatorScreenParams<CreateStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack Navigator
export type HomeStackParamList = {
  Feed: undefined;
  TransformationDetail: {
    transformationId: string;
  };
};

// Booking Stack Navigator
export type BookingStackParamList = {
  ServiceList: undefined;
  ProviderProfile: {
    providerId: string;
  };
  BookingCalendar: {
    serviceId: string;
    providerId: string;
  };
  BookingConfirm: {
    service: Service;
    provider: ProviderProfile;
    appointmentTime: string;
  };
  BookingSuccess: {
    booking: any;
  };
  MyBookings: undefined;
};

// Create Stack Navigator
export type CreateStackParamList = {
  ImageSelector: undefined;
  Editor: {
    imageUri: string;
  };
  Preview: {
    transformationData: {
      imageUri: string;
      beforeImageUri?: string;
      caption: string;
      tags: string[];
    };
  };
};

// Profile Stack Navigator
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
};

// Navigation prop types for screens
export type BookingConfirmScreenNavigationProp = any;
export type BookingConfirmScreenRouteProp = {
  params: BookingStackParamList['BookingConfirm'];
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
