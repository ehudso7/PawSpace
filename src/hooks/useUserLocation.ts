import { useCallback, useEffect, useState } from 'react';
import type { Coordinate } from '../utils/geo';

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const request = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const Location = await import('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission not granted');
        setLocation(null);
      } else {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to get location');
      setLocation(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Attempt once on mount; UI may also call request() from a button
    request();
  }, [request]);

  return { location, error, loading, request };
}
