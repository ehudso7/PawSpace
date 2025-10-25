import { Service, ServiceFilters } from '../types/service';
import { MOCK_SERVICES } from '../mock/services';
import { Coordinate, getUserLocationSafe, haversineDistanceMiles } from '../utils/geo';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function matchesQuery(service: Service, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(service.title).includes(q) ||
    normalize(service.provider.name).includes(q)
  );
}

function isAvailableMatch(service: Service, value: string): boolean {
  if (!value) return true;
  const today = new Date();
  const dateOnly = (d: Date) => d.toISOString().slice(0, 10);
  const slots = service.availability_slots.filter((s) => s.isAvailable);

  if (value === 'today') {
    const t = dateOnly(today);
    return slots.some((slot) => slot.start.slice(0, 10) === t);
  }
  if (value === 'this_week') {
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    return slots.some((slot) => {
      const d = new Date(slot.start);
      return d >= start && d <= end;
    });
  }
  // Expect yyyy-mm-dd or full ISO; compare by date
  const isoDate = value.slice(0, 10);
  return slots.some((slot) => slot.start.slice(0, 10) === isoDate);
}

function applyFilters(services: Service[], filters: ServiceFilters, userLoc: Coordinate | null): Service[] {
  const { service_type, min_price, max_price, max_distance, availability_date, sort_by } = filters;
  let result = services.filter((svc) => {
    if (service_type && service_type !== 'all' && svc.service_type !== (service_type as any)) return false;
    if (min_price != null && svc.price < min_price) return false;
    if (max_price != null && svc.price > max_price) return false;
    if (availability_date && !isAvailableMatch(svc, availability_date)) return false;
    if (max_distance != null && userLoc) {
      const d = haversineDistanceMiles(userLoc, svc.location);
      if (d > max_distance) return false;
    }
    return true;
  });

  if (sort_by) {
    if (sort_by === 'distance' && userLoc) {
      result = result.sort((a, b) => haversineDistanceMiles(userLoc, a.location) - haversineDistanceMiles(userLoc, b.location));
    } else if (sort_by === 'price') {
      result = result.sort((a, b) => a.price - b.price);
    } else if (sort_by === 'rating') {
      result = result.sort((a, b) => b.rating - a.rating);
    } else if (sort_by === 'popularity') {
      result = result.sort((a, b) => b.total_bookings - a.total_bookings);
    }
  }

  return result;
}

export async function getServices(filters: ServiceFilters): Promise<Service[]> {
  // Simulate network latency
  await sleep(250);
  const userLoc = await getUserLocationSafe();
  return applyFilters(MOCK_SERVICES, filters, userLoc);
}

export async function getServiceById(id: string): Promise<Service> {
  await sleep(150);
  const svc = MOCK_SERVICES.find((s) => s.id === id);
  if (!svc) {
    throw new Error('Service not found');
  }
  return svc;
}

export async function searchServices(query: string): Promise<Service[]> {
  await sleep(200);
  const userLoc = await getUserLocationSafe();
  const pre = MOCK_SERVICES.filter((svc) => matchesQuery(svc, query));
  // Maintain a reasonable default sort (by relevance: rating then popularity, distance if available)
  const sorted = pre.sort((a, b) => {
    // Composite score
    const ratingDelta = b.rating - a.rating;
    if (Math.abs(ratingDelta) > 0.01) return ratingDelta;
    const popDelta = b.total_bookings - a.total_bookings;
    if (popDelta !== 0) return popDelta;
    if (userLoc) {
      return haversineDistanceMiles(userLoc, a.location) - haversineDistanceMiles(userLoc, b.location);
    }
    return 0;
  });
  return sorted;
}
