import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack Navigation Types
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
};

// Home Stack Navigation Types
export type HomeStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  UserProfile: { userId: string };
};

// Book Stack Navigation Types
export type BookStackParamList = {
  ServiceList: undefined;
  ServiceDetail: { serviceId: string };
  Booking: { serviceId: string };
  BookingConfirmation: { bookingId: string };
};

// Create Stack Navigation Types
export type CreateStackParamList = {
  ImageSelector: undefined;
  PostComposer: { imageUri: string };
};

// Profile Stack Navigation Types
export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  MyBookings: undefined;
  MyPets: undefined;
};

// Tab Navigation Types
export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookTab: NavigatorScreenParams<BookStackParamList>;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Root Stack Navigation Types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

// Screen Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> = 
  NativeStackScreenProps<HomeStackParamList, T>;

export type BookScreenProps<T extends keyof BookStackParamList> = 
  NativeStackScreenProps<BookStackParamList, T>;

export type CreateScreenProps<T extends keyof CreateStackParamList> = 
  NativeStackScreenProps<CreateStackParamList, T>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = 
  NativeStackScreenProps<ProfileStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  BottomTabScreenProps<TabParamList, T>;

// Declare global types for React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
