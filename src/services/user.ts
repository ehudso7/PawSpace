import { apiGet } from './apiClient';
import type { Pet } from '../types';

export async function getMyPets(): Promise<Pet[]> {
  try {
    return await apiGet<Pet[]>('/me/pets');
  } catch {
    return [];
  }
}

export interface PaymentMethodSummary {
  label: string; // e.g., Visa •••• 4242
}

export async function getSavedPaymentMethodSummary(): Promise<PaymentMethodSummary | null> {
  try {
    return await apiGet<PaymentMethodSummary>('/payments/default-method');
  } catch {
    return null;
  }
}
