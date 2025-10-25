import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { UserLocation } from '../types/booking';

interface UseLocationReturn {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      await getCurrentLocation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location permission');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Optionally get address from coordinates
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        const address = addresses[0];
        const formattedAddress = address
          ? `${address.street || ''} ${address.city || ''}, ${address.region || ''}`
          : undefined;

        setLocation({
          latitude,
          longitude,
          address: formattedAddress,
        });
      } catch {
        // If reverse geocoding fails, still set location without address
        setLocation({
          latitude,
          longitude,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    await getCurrentLocation();
  };

  useEffect(() => {
    // Check if we already have permission
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      if (status === 'granted') {
        getCurrentLocation();
      }
    });
  }, []);

  return {
    location,
    loading,
    error,
    requestPermission,
    refreshLocation,
  };
}