import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '@/types';

interface PetsContextValue {
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id'>) => Promise<Pet>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
}

const PetsContext = createContext<PetsContextValue | undefined>(undefined);

const STORAGE_KEY = 'pets_list_v1';

export const PetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setPets(JSON.parse(json) as Pet[]);
      } catch {
        // ignore
      }
    })();
  }, []);

  const persist = useCallback(async (next: Pet[]) => {
    setPets(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addPet = useCallback(async (pet: Omit<Pet, 'id'>) => {
    const newPet: Pet = { ...pet, id: `pet_${Date.now()}` };
    const next = [newPet, ...pets];
    await persist(next);
    return newPet;
  }, [pets, persist]);

  const updatePet = useCallback(async (id: string, updates: Partial<Pet>) => {
    const next = pets.map((p) => (p.id === id ? { ...p, ...updates } : p));
    await persist(next);
  }, [pets, persist]);

  const deletePet = useCallback(async (id: string) => {
    const next = pets.filter((p) => p.id !== id);
    await persist(next);
  }, [pets, persist]);

  const value = useMemo(() => ({ pets, addPet, updatePet, deletePet }), [pets, addPet, updatePet, deletePet]);

  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
};

export function usePets() {
  const ctx = useContext(PetsContext);
  if (!ctx) throw new Error('usePets must be used within PetsProvider');
  return ctx;
}
