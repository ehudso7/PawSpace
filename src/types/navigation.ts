import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Onboarding: { referrer?: string } | undefined;
};

export type HomeStackParamList = {
  Feed: undefined;
  PostDetails: { postId: string };
};

export type BookStackParamList = {
  ServiceList: { date?: string } | undefined;
  ServiceDetails: { serviceId: string };
  BookingCheckout: { serviceId: string; date: string };
};

export type CreateStackParamList = {
  ImageSelector: undefined;
  CreatePost: { imageUri?: string } | undefined;
};

export type ProfileStackParamList = {
  Profile: { userId?: string } | undefined;
  EditProfile: undefined;
  Settings: undefined;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookTab: NavigatorScreenParams<BookStackParamList>;
  CreateTab: NavigatorScreenParams<CreateStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};
