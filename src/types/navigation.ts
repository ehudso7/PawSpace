export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

export type HomeStackParamList = {
  Feed: undefined;
  TransformationDetail: { transformationId: string };
};

export type BookingStackParamList = {
  ServiceList: undefined;
  ProviderProfile: { providerId: string };
  BookingCalendar: { providerId: string; service?: unknown };
  BookingConfirm: { bookingId?: string };
  MyBookings: undefined;
};

export type CreateStackParamList = {
  ImageSelector: undefined;
  Editor: { imageUri?: string };
  Preview: { transformationData: unknown };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};
