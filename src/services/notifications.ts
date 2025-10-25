import React, { createContext, useContext, useEffect, useMemo } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './supabase';
import { navigationRef, navigate } from '@/navigation/navigationRef';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationParams {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

class NotificationService {
  async registerForPushNotifications(): Promise<string | undefined> {
    if (!Device.isDevice) {
      // eslint-disable-next-line no-alert
      alert('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      // eslint-disable-next-line no-alert
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId: (Constants?.expoConfig as any)?.extra?.eas?.projectId })).data;

    const { data: user } = await supabase.auth.getUser();
    const currentUserId = user.user?.id;
    if (currentUserId) {
      await supabase.from('users').update({ push_token: token }).eq('id', currentUserId);
    }

    return token;
  }

  async sendNotification(params: NotificationParams): Promise<void> {
    // Implement: POST to backend that relays to Expo push service
    // Placeholder: log local
    // eslint-disable-next-line no-console
    console.log('sendNotification called', params);
  }

  setupNotificationHandlers() {
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      if (data && typeof data === 'object') {
        if (data.type === 'booking_confirmed' && data.booking_id) {
          navigate('BookingDetail', { id: String(data.booking_id) });
        }
      }
    });
  }
}

const service = new NotificationService();

interface NotificationsContextValue {
  register: () => Promise<string | undefined>;
  send: (params: NotificationParams) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    service.setupNotificationHandlers();
    service.registerForPushNotifications().catch(() => {});
  }, []);

  const value = useMemo<NotificationsContextValue>(() => ({
    register: () => service.registerForPushNotifications(),
    send: (params) => service.sendNotification(params),
  }), []);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
