import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Best-effort: requests permission and returns current coordinates. Falls back to a default if denied.
export async function getCurrentLocationSafe(): Promise<Coordinates | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    return null;
  }
}

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Haversine distance in miles
export function getDistanceMiles(a: Coordinates, b: Coordinates): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const sinDlat = Math.sin(dLat / 2);
  const sinDlon = Math.sin(dLon / 2);

  const h = sinDlat * sinDlat + Math.cos(lat1) * Math.cos(lat2) * sinDlon * sinDlon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function formatDistance(miles?: number | null): string {
  if (miles === undefined || miles === null || Number.isNaN(miles)) return '';
  if (miles < 0.1) return '<0.1 mi';
  return `${miles.toFixed(1)} mi`;
}
