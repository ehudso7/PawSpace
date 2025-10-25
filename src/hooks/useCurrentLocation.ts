import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Coordinates } from '@/utils/location';

interface State {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
}

export function useCurrentLocation(): State {
  const [state, setState] = useState<State>({ coords: null, loading: true, error: null, permissionStatus: null });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;
        if (status !== 'granted') {
          setState({ coords: null, loading: false, error: 'Location permission not granted', permissionStatus: status });
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!isMounted) return;
        setState({
          coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          loading: false,
          error: null,
          permissionStatus: status,
        });
      } catch (e: any) {
        if (!isMounted) return;
        setState({ coords: null, loading: false, error: e?.message ?? 'Failed to get location', permissionStatus: null });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
