import { NavigatorScreenParams } from '@react-navigation/native';

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
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
};

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