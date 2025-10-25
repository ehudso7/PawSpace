import { ProviderProfile, Service, TimeSlot } from '@/types/booking';

const baseLatitude = 37.7749; // San Francisco
const baseLongitude = -122.4194;

function offsetCoord(value: number, miles: number, axis: 'lat' | 'lon'): number {
  // Approx conversions
  const milesPerDegreeLat = 69.0;
  const milesPerDegreeLon = 69.172 * Math.cos((baseLatitude * Math.PI) / 180);
  const delta = miles / (axis === 'lat' ? milesPerDegreeLat : milesPerDegreeLon);
  return value + delta;
}

function makeSlots(daysAhead = 14): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();
  for (let i = 0; i < daysAhead; i += 1) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    const avail = i % 2 === 0; // every other day
    slots.push({ date, start: '09:00', end: '12:00', is_available: avail });
    slots.push({ date, start: '13:00', end: '17:00', is_available: !avail });
  }
  return slots;
}

const providers: ProviderProfile[] = [
  {
    id: 'prov_1',
    name: 'Furry Friends Co.',
    avatar_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&h=200&fit=crop',
    bio: 'Trusted local pet care experts.',
    rating: 4.7,
    total_reviews: 128,
    years_of_experience: 6,
    verified: true,
    location: { address: 'Market St, SF', latitude: baseLatitude, longitude: baseLongitude },
  },
  {
    id: 'prov_2',
    name: 'Happy Paws',
    avatar_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=200&h=200&fit=crop',
    bio: 'We love your pets like our own.',
    rating: 4.9,
    total_reviews: 256,
    years_of_experience: 8,
    verified: true,
    location: { address: 'Mission District, SF', latitude: offsetCoord(baseLatitude, 2, 'lat'), longitude: offsetCoord(baseLongitude, 2, 'lon') },
  },
  {
    id: 'prov_3',
    name: 'City Pet Care',
    avatar_url: 'https://images.unsplash.com/photo-1542060748-10c28b62716e?q=80&w=200&h=200&fit=crop',
    bio: 'Professional and reliable.',
    rating: 4.4,
    total_reviews: 74,
    years_of_experience: 4,
    verified: false,
    location: { address: 'SoMa, SF', latitude: offsetCoord(baseLatitude, 5, 'lat'), longitude: offsetCoord(baseLongitude, 5, 'lon') },
  },
  {
    id: 'prov_4',
    name: 'Bay Area Vets',
    avatar_url: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=200&h=200&fit=crop',
    bio: 'Compassionate veterinary care.',
    rating: 4.8,
    total_reviews: 310,
    years_of_experience: 12,
    verified: true,
    location: { address: 'Sunset, SF', latitude: offsetCoord(baseLatitude, 10, 'lat'), longitude: offsetCoord(baseLongitude, 10, 'lon') },
  },
  {
    id: 'prov_5',
    name: 'Top Dog Trainers',
    avatar_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=200&h=200&fit=crop',
    bio: 'Positive reinforcement experts.',
    rating: 4.6,
    total_reviews: 92,
    years_of_experience: 7,
    verified: true,
    location: { address: 'Berkeley, CA', latitude: offsetCoord(baseLatitude, 12, 'lat'), longitude: offsetCoord(baseLongitude, 12, 'lon') },
  },
];

const imagePools = {
  grooming: [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1577906096421-d6facf3c9371?q=80&w=1080&fit=crop',
  ],
  walking: [
    'https://images.unsplash.com/photo-1558944351-c6ae230f9871?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1080&fit=crop',
  ],
  vet_care: [
    'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1080&fit=crop',
  ],
  training: [
    'https://images.unsplash.com/photo-1601758064133-6b6e1b9b849e?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=1080&fit=crop',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1080&fit=crop',
  ],
};

function makeService(idNum: number, providerIdx: number, type: 'grooming' | 'walking' | 'vet_care' | 'training', extraMiles: number): Service {
  const provider = providers[providerIdx % providers.length];
  const priceBase = { grooming: 60, walking: 25, vet_care: 120, training: 80 }[type];
  const durationBase = { grooming: 90, walking: 30, vet_care: 45, training: 60 }[type];
  const id = `svc_${idNum}`;
  const lat = offsetCoord(provider.location.latitude, extraMiles, 'lat');
  const lon = offsetCoord(provider.location.longitude, extraMiles, 'lon');
  return {
    id,
    provider_id: provider.id,
    provider,
    title: `${type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Service #${idNum}`,
    description: 'High-quality, caring and reliable pet service tailored to your needs.',
    service_type: type,
    price: Math.round(priceBase + (idNum % 5) * 5),
    duration: durationBase + (idNum % 3) * 15,
    location: { address: provider.location.address, latitude: lat, longitude: lon },
    images: imagePools[type],
    rating: Math.min(5, Math.max(3.8, provider.rating + ((idNum % 3) - 1) * 0.2)),
    total_bookings: 20 + (idNum % 50),
    availability_slots: makeSlots(),
    created_at: new Date(Date.now() - idNum * 86400000).toISOString(),
  };
}

export const mockServices: Service[] = [];
const types: Array<'grooming' | 'walking' | 'vet_care' | 'training'> = ['grooming', 'walking', 'vet_care', 'training'];
let counter = 1;
for (let i = 0; i < 24; i += 1) {
  const t = types[i % types.length];
  const pIdx = i % providers.length;
  const extraMiles = (i % 12) * 1.5; // spread out
  mockServices.push(makeService(counter, pIdx, t, extraMiles));
  counter += 1;
}
