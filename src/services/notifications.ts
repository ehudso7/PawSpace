import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NotificationParams } from '@/types';
import { navigationRef, navigate } from '@/navigation/navigationRef';
import { updateUserPushToken } from '@/services/supabase';

export class NotificationService {
  async registerForPushNotifications(currentUserId?: string): Promise<string | undefined> {
    if (!Device.isDevice) {
      // eslint-disable-next-line no-alert
      alert('Must use physical device for Push Notifications');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
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

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (currentUserId) {
      try {
        await updateUserPushToken(currentUserId, token);
      } catch (e) {
        // ignore silently; Sentry will pick up uncaught errors elsewhere
      }
    }

    return token;
  }

  async sendNotification(params: NotificationParams): Promise<void> {
    // Client-side send via Expo push service (for demo). Prefer backend in production.
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: params.to,
        title: params.title,
        body: params.body,
        data: params.data,
      }),
    });
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
      if (!data) return;
      // Navigate based on notification type
      if (data.type === 'booking_confirmed' && data.booking_id) {
        navigate('BookingDetail', { id: data.booking_id });
      }
    });
  }
}
