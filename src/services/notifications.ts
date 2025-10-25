import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { navigationRef, navigate } from '@/navigation/navigationRef';

export interface NotificationParams {
  to: string; // Push token
  title: string;
  body: string;
  data?: any;
}

export class NotificationService {
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

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    // Save token to user's profile in Supabase (placeholder)
    const currentUser = { id: 'demo-user' };
    await supabase
      .from('users')
      .update({ push_token: token })
      .eq('id', currentUser.id);

    return token;
  }

  async sendNotification(_params: NotificationParams): Promise<void> {
    // Implement by calling your backend to send via Expo Push API
    // This is a placeholder to keep the surface area ready
    return Promise.resolve();
  }

  setupNotificationHandlers() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      const data: any = response.notification.request.content.data;
      // Navigate based on notification type
      if (data?.type === 'booking_confirmed') {
        navigate('BookingDetail', { id: data.booking_id });
      } else if (data?.screen) {
        navigate(data.screen, data.params ?? {});
      }
    });
  }
}
