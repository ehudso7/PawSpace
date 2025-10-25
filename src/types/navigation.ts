// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
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
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
};
