import { Service, ServiceFilters, PaginatedResponse, UserLocation } from '../types/booking';
import { calculateDistance } from '../utils/distance';

// Mock API base URL - replace with actual API endpoint
const API_BASE_URL = 'https://api.pawspace.com';

// Mock data for development
const mockServices: Service[] = [
  {
    id: '1',
    provider_id: 'p1',
    provider: {
      id: 'p1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      rating: 4.8,
      total_reviews: 127,
      verified: true,
    },
    title: 'Premium Dog Grooming',
    description: 'Full service grooming including bath, nail trim, and styling',
    service_type: 'grooming',
    price: 65,
    duration: 120,
    location: {
      address: '123 Main St, Austin, TX',
      latitude: 30.2672,
      longitude: -97.7431,
    },
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    ],
    rating: 4.9,
    total_bookings: 234,
    availability_slots: [],
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    provider_id: 'p2',
    provider: {
      id: 'p2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.6,
      total_reviews: 89,
      verified: true,
    },
    title: 'Daily Dog Walking',
    description: 'Reliable daily walks for your furry friend',
    service_type: 'walking',
    price: 25,
    duration: 30,
    location: {
      address: '456 Oak Ave, Austin, TX',
      latitude: 30.2849,
      longitude: -97.7341,
    },
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    ],
    rating: 4.7,
    total_bookings: 156,
    availability_slots: [],
    created_at: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    provider_id: 'p3',
    provider: {
      id: 'p3',
      name: 'Dr. Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      rating: 4.9,
      total_reviews: 203,
      verified: true,
    },
    title: 'Mobile Veterinary Care',
    description: 'Comprehensive vet services at your home',
    service_type: 'vet_care',
    price: 120,
    duration: 60,
    location: {
      address: '789 Elm St, Austin, TX',
      latitude: 30.2500,
      longitude: -97.7500,
    },
    images: [
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
      'https://images.unsplash.com/photo-1581888227599-779811939961?w=400',
    ],
    rating: 4.9,
    total_bookings: 98,
    availability_slots: [],
    created_at: '2024-01-20T09:15:00Z',
  },
  {
    id: '4',
    provider_id: 'p4',
    provider: {
      id: 'p4',
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.5,
      total_reviews: 67,
      verified: false,
    },
    title: 'Basic Obedience Training',
    description: 'Professional dog training for basic commands',
    service_type: 'training',
    price: 80,
    duration: 90,
    location: {
      address: '321 Pine St, Austin, TX',
      latitude: 30.2800,
      longitude: -97.7600,
    },
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    ],
    rating: 4.4,
    total_bookings: 45,
    availability_slots: [],
    created_at: '2024-01-25T16:45:00Z',
  },
];

/**
 * Simulate API delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate distances for services based on user location
 */
function addDistancesToServices(services: Service[], userLocation?: UserLocation): Service[] {
  if (!userLocation) return services;
  
  return services.map(service => ({
    ...service,
    distance: calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      service.location.latitude,
      service.location.longitude
    ),
  }));
}

/**
 * Filter services based on provided filters
 */
function filterServices(services: Service[], filters: ServiceFilters): Service[] {
  let filtered = [...services];

  // Filter by service type
  if (filters.service_type && filters.service_type !== 'all') {
    filtered = filtered.filter(service => service.service_type === filters.service_type);
  }

  // Filter by price range
  if (filters.min_price !== undefined) {
    filtered = filtered.filter(service => service.price >= filters.min_price!);
  }
  if (filters.max_price !== undefined) {
    filtered = filtered.filter(service => service.price <= filters.max_price!);
  }

  // Filter by distance
  if (filters.max_distance !== undefined) {
    filtered = filtered.filter(service => 
      service.distance === undefined || service.distance <= filters.max_distance!
    );
  }

  // Filter by search query
  if (filters.search_query) {
    const query = filters.search_query.toLowerCase();
    filtered = filtered.filter(service =>
      service.title.toLowerCase().includes(query) ||
      service.provider.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Sort services based on sort option
 */
function sortServices(services: Service[], sortBy: string = 'distance'): Service[] {
  const sorted = [...services];

  switch (sortBy) {
    case 'distance':
      return sorted.sort((a, b) => {
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popularity':
      return sorted.sort((a, b) => b.total_bookings - a.total_bookings);
    default:
      return sorted;
  }
}

/**
 * Get services with filtering, sorting, and pagination
 */
export async function getServices(
  filters: ServiceFilters = {},
  userLocation?: UserLocation,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Service>> {
  await delay(800); // Simulate API call

  // Add distances to services
  let services = addDistancesToServices(mockServices, userLocation);

  // Apply filters
  services = filterServices(services, filters);

  // Apply sorting
  services = sortServices(services, filters.sort_by);

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedServices = services.slice(startIndex, endIndex);

  return {
    data: paginatedServices,
    pagination: {
      page,
      limit,
      total: services.length,
      has_more: endIndex < services.length,
    },
  };
}

/**
 * Get a single service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  await delay(300);
  
  const service = mockServices.find(s => s.id === id);
  return service || null;
}

/**
 * Search services by query string
 */
export async function searchServices(
  query: string,
  userLocation?: UserLocation,
  limit: number = 20
): Promise<Service[]> {
  await delay(500);

  const filters: ServiceFilters = {
    search_query: query,
    sort_by: 'rating',
  };

  const result = await getServices(filters, userLocation, 1, limit);
  return result.data;
}

/**
 * Get popular services (most booked)
 */
export async function getPopularServices(
  userLocation?: UserLocation,
  limit: number = 10
): Promise<Service[]> {
  const filters: ServiceFilters = {
    sort_by: 'popularity',
  };

  const result = await getServices(filters, userLocation, 1, limit);
  return result.data;
}

/**
 * Get nearby services within specified distance
 */
export async function getNearbyServices(
  userLocation: UserLocation,
  maxDistance: number = 10,
  limit: number = 10
): Promise<Service[]> {
  const filters: ServiceFilters = {
    max_distance: maxDistance,
    sort_by: 'distance',
  };

  const result = await getServices(filters, userLocation, 1, limit);
  return result.data;
}