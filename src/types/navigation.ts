import type { NavigatorScreenParams, RouteProp, CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth flow
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
};

// Home tab stack
export type HomeStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
};

// Book tab stack
export type BookStackParamList = {
  ServiceList: undefined;
  ServiceDetail: { serviceId: string };
};

// Create tab stack
export type CreateStackParamList = {
  ImageSelector: undefined;
  CreatePreview: { imageUri?: string } | undefined;
};

// Profile tab stack
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

// Bottom tabs
export type TabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  BookStack: NavigatorScreenParams<BookStackParamList>;
  CreateStack: NavigatorScreenParams<CreateStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Optional root stack (useful if app uses a root container stack)
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

// Screen prop helpers for strong typing
export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, Screen>;

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, Screen>;

export type BookStackScreenProps<Screen extends keyof BookStackParamList> =
  NativeStackScreenProps<BookStackParamList, Screen>;

export type CreateStackScreenProps<Screen extends keyof CreateStackParamList> =
  NativeStackScreenProps<CreateStackParamList, Screen>;

export type ProfileStackScreenProps<Screen extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, Screen>;

export type TabScreenProps<Screen extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, Screen>,
  RootStackScreenProps<'Main'>
>;

export type ScreenRouteProp<
  TParamList,
  TRouteName extends keyof TParamList
> = RouteProp<TParamList, TRouteName>;
