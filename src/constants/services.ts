import { ServiceType } from '../types/service';

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  grooming: 'Grooming',
  walking: 'Walking',
  vet_care: 'Vet Care',
  training: 'Training',
};

export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  grooming: '#FFB6C1',
  walking: '#90EE90',
  vet_care: '#87CEEB',
  training: '#FFD580',
};
