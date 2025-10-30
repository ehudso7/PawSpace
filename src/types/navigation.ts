// Navigation param lists used across the app

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

export type TabParamList = {
  Home: undefined;
  Booking: undefined;
  Create: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Feed: undefined;
  TransformationDetail: { transformationId?: string } | undefined;
};

export type BookingStackParamList = {
  ServiceList: undefined;
  ProviderProfile: { providerId?: string } | undefined;
  BookingCalendar: { serviceId?: string } | undefined;
  BookingConfirm: { bookingId?: string } | undefined;
  MyBookings: undefined;
};

export type CreateStackParamList = {
  ImageSelector: undefined;
  Editor: undefined;
  Preview: undefined;
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
