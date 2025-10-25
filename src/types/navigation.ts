<<<<<<< HEAD
import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

// Auth Stack Navigator
=======
<<<<<<< HEAD
// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
=======
import { NavigatorScreenParams } from '@react-navigation/native';
>>>>>>> origin/main

>>>>>>> origin/main
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

<<<<<<< HEAD
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
    bookingData: {
      serviceId: string;
      providerId: string;
      date: string;
      timeSlot: string;
      totalAmount: number;
    };
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
=======
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
>>>>>>> origin/main
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
};
<<<<<<< HEAD

// Screen Props Types
export type ScreenProps<T extends keyof any, P extends keyof any> = {
  navigation: any;
  route: {
    params: T extends keyof RootStackParamList
      ? RootStackParamList[T] extends NavigatorScreenParams<infer U>
        ? P extends keyof U
          ? U[P]
          : never
        : never
      : T extends keyof AuthStackParamList
      ? P extends keyof AuthStackParamList
        ? AuthStackParamList[P]
        : never
      : T extends keyof HomeStackParamList
      ? P extends keyof HomeStackParamList
        ? HomeStackParamList[P]
        : never
      : T extends keyof BookingStackParamList
      ? P extends keyof BookingStackParamList
        ? BookingStackParamList[P]
        : never
      : T extends keyof CreateStackParamList
      ? P extends keyof CreateStackParamList
        ? CreateStackParamList[P]
        : never
      : T extends keyof ProfileStackParamList
      ? P extends keyof ProfileStackParamList
        ? ProfileStackParamList[P]
        : never
      : never;
  };
};
=======
<<<<<<< HEAD
=======

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
>>>>>>> origin/main
>>>>>>> origin/main
