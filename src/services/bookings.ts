import dayjs from 'dayjs';
import { Service, ServiceFilters } from '@/types/booking';
import { mockServices } from '@/data/mockServices';
import { Coordinates, getCurrentLocationSafe, getDistanceMiles } from '@/utils/location';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withinPrice(service: Service, min?: number, max?: number): boolean {
  if (typeof min === 'number' && service.price < min) return false;
  if (typeof max === 'number' && service.price > max) return false;
  return true;
}

function hasAvailabilityOnDate(service: Service, date?: string): boolean {
  if (!date) return true;
  return service.availability_slots.some((s) => s.is_available && s.date === date);
}

function sortServices(services: Service[], sortBy: ServiceFilters['sort_by'], userCoords: Coordinates | null): Service[] {
  const copy = [...services];
  switch (sortBy) {
    case 'price':
      return copy.sort((a, b) => a.price - b.price);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'popularity':
      return copy.sort((a, b) => b.total_bookings - a.total_bookings);
    case 'distance':
      if (!userCoords) return copy; // no-op
      return copy.sort((a, b) => {
        const da = getDistanceMiles(userCoords, a.location);
        const db = getDistanceMiles(userCoords, b.location);
        return da - db;
      });
    default:
      return copy;
  }
}

export async function getServices(filters: ServiceFilters): Promise<Service[]> {
  // Simulate network latency
  await sleep(300);

  let results = mockServices.filter((s) => {
    const typeOk = filters.service_type ? s.service_type === (filters.service_type as any) : true;
    const priceOk = withinPrice(s, filters.min_price, filters.max_price);
    const availOk = hasAvailabilityOnDate(s, filters.availability_date);
    return typeOk && priceOk && availOk;
  });

  let userCoords: Coordinates | null = null;
  try {
    userCoords = await getCurrentLocationSafe();
  } catch {
    userCoords = null;
  }

  // Distance filter
  if (filters.max_distance && userCoords) {
    results = results.filter((s) => getDistanceMiles(userCoords!, s.location) <= (filters.max_distance as number));
  }

  // Sorting
  results = sortServices(results, filters.sort_by, userCoords);

  return results;
}

export async function getServiceById(id: string): Promise<Service> {
  await sleep(200);
  const svc = mockServices.find((s) => s.id === id);
  if (!svc) throw new Error('Service not found');
  return svc;
}

export async function searchServices(query: string): Promise<Service[]> {
  await sleep(250);
  const q = query.trim().toLowerCase();
  if (!q) return mockServices;
  return mockServices.filter((s) =>
    s.title.toLowerCase().includes(q) || s.provider.name.toLowerCase().includes(q)
  );
}
