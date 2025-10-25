import { ProviderProfile, Service, ServiceType, TimeSlot } from '../types/service';

const SERVICE_TYPES: ServiceType[] = ['grooming', 'walking', 'vet_care', 'training'];

const TITLE_BY_TYPE: Record<ServiceType, string[]> = {
  grooming: [
    'Full Grooming Package',
    'Nail Trim & Bath',
    'Pawdicure Deluxe',
    'Coat De-shedding Session',
  ],
  walking: [
    '30-min Neighborhood Walk',
    '60-min Trail Adventure',
    'Quick Potty Break',
    'Evening Walk & Play',
  ],
  vet_care: [
    'Wellness Checkup',
    'Vaccination Visit',
    'Senior Pet Care',
    'Puppy Health Starter',
  ],
  training: [
    'Obedience Basics',
    'Leash Manners',
    'Puppy Socialization',
    'Behavioral Consultation',
  ],
};

const DESCRIPTIONS = [
  'Personalized care for your furry friend with a gentle approach and attention to detail.',
  'Flexible scheduling with professional, reliable, and friendly service.',
  'Experienced provider with a passion for pets and positive reviews.',
  'Safe, fun, and effective sessions tailored to your pet\'s needs.',
];

const BASE_LOCATION = { latitude: 37.7749, longitude: -122.4194, address: 'San Francisco, CA' };

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Generates a random coordinate within ~maxDistanceKm of a base point
function randomCoordinateNear(
  baseLat: number,
  baseLng: number,
  maxDistanceKm = 30
): { latitude: number; longitude: number } {
  const r = maxDistanceKm / 111; // ~degrees per km
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  const newLat = baseLat + y;
  const newLng = baseLng + x / Math.cos((baseLat * Math.PI) / 180);
  return { latitude: newLat, longitude: newLng };
}

function makeAvailability(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();
  for (let d = 0; d < 10; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const dayStr = day.toISOString().slice(0, 10);
    const start = new Date(`${dayStr}T09:00:00.000Z`);
    const end = new Date(`${dayStr}T17:00:00.000Z`);
    // create 4 2-hour slots
    for (let i = 0; i < 4; i++) {
      const s = new Date(start);
      s.setHours(start.getHours() + i * 2);
      const e = new Date(s);
      e.setHours(s.getHours() + 2);
      slots.push({ start: s.toISOString(), end: e.toISOString(), isAvailable: Math.random() > 0.2 });
    }
  }
  return slots;
}

function makeImages(seed: number): string[] {
  return [
    `https://picsum.photos/seed/${seed}a/800/600`,
    `https://picsum.photos/seed/${seed}b/800/600`,
    `https://picsum.photos/seed/${seed}c/800/600`,
    `https://picsum.photos/seed/${seed}d/800/600`,
  ];
}

function makeProvider(seed: number): ProviderProfile {
  const { latitude, longitude } = randomCoordinateNear(BASE_LOCATION.latitude, BASE_LOCATION.longitude, 50);
  return {
    id: `prov_${seed}`,
    name: `Provider ${seed}`,
    avatarUrl: `https://i.pravatar.cc/150?img=${(seed % 70) + 1}`,
    rating: Math.round(randomInRange(38, 50)) / 10, // 3.8 - 5.0
    totalReviews: Math.floor(randomInRange(10, 500)),
    location: {
      address: 'Around the city',
      latitude,
      longitude,
    },
    bio: 'Lifelong pet lover with years of experience in quality pet services.',
    specialties: SERVICE_TYPES.filter(() => Math.random() > 0.5),
  };
}

function makeService(seed: number): Service {
  const provider = makeProvider(seed);
  const service_type = SERVICE_TYPES[seed % SERVICE_TYPES.length];
  const titlePool = TITLE_BY_TYPE[service_type];
  const title = titlePool[seed % titlePool.length];
  const priceBase = service_type === 'walking' ? 20 : service_type === 'grooming' ? 45 : service_type === 'vet_care' ? 70 : 50;
  const price = Math.round(randomInRange(priceBase, priceBase + 80));
  const duration = service_type === 'walking' ? (Math.random() > 0.5 ? 30 : 60) : Math.floor(randomInRange(30, 120));
  const images = makeImages(seed);
  const availability_slots = makeAvailability();
  const { latitude, longitude } = provider.location;

  return {
    id: `svc_${seed}`,
    provider_id: provider.id,
    provider,
    title,
    description: DESCRIPTIONS[seed % DESCRIPTIONS.length],
    service_type,
    price,
    duration,
    location: {
      address: 'Provider service area',
      latitude,
      longitude,
    },
    images,
    rating: provider.rating,
    total_bookings: Math.floor(randomInRange(20, 1200)),
    availability_slots,
    created_at: new Date(Date.now() - seed * 86400000).toISOString(),
  };
}

export const MOCK_SERVICES: Service[] = Array.from({ length: 60 }, (_, i) => makeService(i + 1));
