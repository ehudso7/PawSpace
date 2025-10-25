import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Navigator Types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

// Auth Stack Navigator Types
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
};

// Tab Navigator Types
export type TabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  BookStack: NavigatorScreenParams<BookStackParamList>;
  CreateStack: NavigatorScreenParams<CreateStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack Types
export type HomeStackParamList = {
  FeedScreen: undefined;
  PostDetail: {
    postId: string;
    userId: string;
  };
  UserProfile: {
    userId: string;
  };
};

// Book Stack Types
export type BookStackParamList = {
  ServiceListScreen: undefined;
  ServiceDetail: {
    serviceId: string;
    serviceName: string;
  };
  BookingForm: {
    serviceId: string;
    serviceName: string;
    providerId: string;
  };
  BookingConfirmation: {
    bookingId: string;
  };
};

// Create Stack Types
export type CreateStackParamList = {
  ImageSelectorScreen: undefined;
  PostEditor: {
    selectedImages: string[];
  };
  ServiceEditor: {
    serviceId?: string;
    isEdit?: boolean;
  };
};

// Profile Stack Types
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  Settings: undefined;
  MyBookings: undefined;
  MyServices: undefined;
  Notifications: undefined;
};

// Navigation Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: any;
  route: { params: RootStackParamList[T] };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: any;
  route: { params: AuthStackParamList[T] };
};

export type TabScreenProps<T extends keyof TabParamList> = {
  navigation: any;
  route: { params: TabParamList[T] };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = {
  navigation: any;
  route: { params: HomeStackParamList[T] };
};

export type BookStackScreenProps<T extends keyof BookStackParamList> = {
  navigation: any;
  route: { params: BookStackParamList[T] };
};

export type CreateStackScreenProps<T extends keyof CreateStackParamList> = {
  navigation: any;
  route: { params: CreateStackParamList[T] };
};

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = {
  navigation: any;
  route: { params: ProfileStackParamList[T] };
};

// Deep Linking Types
export type LinkingConfig = {
  screens: {
    Auth: {
      screens: {
        Login: 'login';
        Signup: 'signup';
        Onboarding: 'onboarding';
      };
    };
    Main: {
      screens: {
        HomeStack: {
          screens: {
            FeedScreen: 'home';
            PostDetail: 'post/:postId';
            UserProfile: 'user/:userId';
          };
        };
        BookStack: {
          screens: {
            ServiceListScreen: 'services';
            ServiceDetail: 'service/:serviceId';
            BookingForm: 'book/:serviceId';
            BookingConfirmation: 'booking/:bookingId';
          };
        };
        CreateStack: {
          screens: {
            ImageSelectorScreen: 'create';
            PostEditor: 'create/post';
            ServiceEditor: 'create/service';
          };
        };
        ProfileStack: {
          screens: {
            ProfileScreen: 'profile';
            EditProfile: 'profile/edit';
            Settings: 'settings';
            MyBookings: 'bookings';
            MyServices: 'my-services';
            Notifications: 'notifications';
          };
        };
      };
    };
  };
};