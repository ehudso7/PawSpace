import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types';

const SETTINGS_KEY = 'app_settings_v1';

export const defaultSettings: AppSettings = {
  notifications: {
    push: true,
    email: true,
    bookingReminders: true,
    newFollowers: true,
    commentsLikes: true,
    promos: false,
  },
  privacy: {
    profileVisibility: 'public',
    showLocation: true,
    whoCanMessage: 'everyone',
    blockedUserIds: [],
  },
  app: {
    language: 'en',
    theme: 'auto',
    dataUsage: 'standard',
  },
};

export async function loadSettings(): Promise<AppSettings> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!json) return defaultSettings;
    const parsed = JSON.parse(json) as AppSettings;
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
