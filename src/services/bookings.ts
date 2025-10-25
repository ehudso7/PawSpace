import { Service, ServiceFilters, PaginatedResponse, Location } from '../types/booking';
import { calculateDistance } from '../utils/geolocation';

// API base URL - adjust this to your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Service cache for optimization
 */
const serviceCache = new Map<string, { data: Service[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch services with filters and pagination
 */
export const getServices = async (
  filters: ServiceFilters,
  page: number = 1,
  limit: number = 20,
  userLocation?: Location
): Promise<PaginatedResponse<Service>> => {
  try {
    const cacheKey = JSON.stringify({ filters, page, limit });
    const cached = serviceCache.get(cacheKey);
    
    // Return cached data if it's still fresh
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const services = cached.data;
      return {
        data: services,
        page,
        total_pages: Math.ceil(services.length / limit),
        total_items: services.length,
        has_more: page < Math.ceil(services.length / limit),
      };
    }

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.service_type && filters.service_type !== 'All') {
      params.append('service_type', filters.service_type.toLowerCase());
    }
    if (filters.min_price !== undefined) {
      params.append('min_price', filters.min_price.toString());
    }
    if (filters.max_price !== undefined) {
      params.append('max_price', filters.max_price.toString());
    }
    if (filters.availability_date) {
      params.append('availability_date', filters.availability_date);
    }
    if (userLocation) {
      params.append('latitude', userLocation.latitude.toString());
      params.append('longitude', userLocation.longitude.toString());
    }
    if (filters.max_distance !== undefined) {
      params.append('max_distance', filters.max_distance.toString());
    }
    if (filters.sort_by) {
      params.append('sort_by', filters.sort_by);
    }

    const response = await fetch(`${API_BASE_URL}/services?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }

    const data = await response.json();

    // Calculate distances if user location is provided
    if (userLocation && data.data) {
      data.data = data.data.map((service: Service) => ({
        ...service,
        distance: calculateDistance(userLocation, service.location),
      }));

      // Apply client-side distance filtering
      if (filters.max_distance) {
        data.data = data.data.filter(
          (service: Service & { distance?: number }) =>
            service.distance !== undefined && service.distance <= filters.max_distance!
        );
      }

      // Apply client-side sorting if needed
      if (filters.sort_by === 'distance') {
        data.data.sort((a: Service & { distance?: number }, b: Service & { distance?: number }) =>
          (a.distance || 0) - (b.distance || 0)
        );
      }
    }

    // Cache the results
    serviceCache.set(cacheKey, {
      data: data.data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Fetch a single service by ID
 */
export const getServiceById = async (id: string): Promise<Service> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    throw error;
  }
};

/**
 * Search services by query string (searches in title, description, provider name)
 */
export const searchServices = async (
  query: string,
  userLocation?: Location
): Promise<Service[]> => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const params = new URLSearchParams({
      q: query.trim(),
    });

    if (userLocation) {
      params.append('latitude', userLocation.latitude.toString());
      params.append('longitude', userLocation.longitude.toString());
    }

    const response = await fetch(`${API_BASE_URL}/services/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search services: ${response.statusText}`);
    }

    const data = await response.json();

    // Calculate distances if user location is provided
    if (userLocation && data.results) {
      data.results = data.results.map((service: Service) => ({
        ...service,
        distance: calculateDistance(userLocation, service.location),
      }));
    }

    return data.results || [];
  } catch (error) {
    console.error('Error searching services:', error);
    throw error;
  }
};

/**
 * Clear the service cache
 */
export const clearServiceCache = (): void => {
  serviceCache.clear();
};

/**
 * Invalidate specific cache entry
 */
export const invalidateServiceCache = (filters: ServiceFilters, page: number = 1, limit: number = 20): void => {
  const cacheKey = JSON.stringify({ filters, page, limit });
  serviceCache.delete(cacheKey);
};
