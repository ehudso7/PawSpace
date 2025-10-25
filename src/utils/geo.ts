export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceMiles(a: Coordinate, b: Coordinate): number {
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

export function formatMiles(distance: number | undefined, fractionDigits = 1): string {
  if (distance == null || Number.isNaN(distance)) return '';
  if (distance < 0.1) return '<0.1 mi';
  return `${distance.toFixed(fractionDigits)} mi`;
}

// Safe wrapper around expo-location. Import lazily to avoid SSR/Node issues.
export async function getUserLocationSafe(): Promise<Coordinate | null> {
  try {
    // Dynamically import to avoid bundlers evaluating in Node
    const Location = await import('expo-location');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    const position = await Location.getCurrentPositionAsync({});
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch (e) {
    // In environments without expo-location or on error, return null
    return null;
  }
}
