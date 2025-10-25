import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: Record<string, any>) {
  if (navigationRef.isReady()) {
    // @ts-expect-error generic route name
    navigationRef.navigate(name as never, params as never);
  }
}
