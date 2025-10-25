import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: Record<string, unknown>) {
  if (navigationRef.isReady()) {
    // @ts-expect-error - React Navigation typing is complex; casting here
    navigationRef.navigate(name as never, params as never);
  }
}
