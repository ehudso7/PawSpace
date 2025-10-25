import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Profile: { userId?: string } | undefined;
  EditProfile: undefined;
  MyPets: undefined;
  AddEditPet: { petId?: string } | undefined;
  Settings: undefined;
  BookingDetail: { id: string };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name]
) {
  if (navigationRef.isReady()) {
    // @ts-expect-error params can be undefined
    navigationRef.navigate(name, params);
  }
}
