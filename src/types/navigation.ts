import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
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
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}