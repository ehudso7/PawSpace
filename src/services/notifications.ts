import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/navigation/NavigationService';

export interface NotificationParams {
  to: string; // Push token
  title: string;
  body: string;
  data?: any;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  async registerForPushNotifications(currentUserId?: string): Promise<string | undefined> {
    if (!Device.isDevice) {
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
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (currentUserId) {
      await supabase
        .from('users')
        .update({ push_token: token })
        .eq('id', currentUserId);
    }

    return token;
  }

  async sendNotification(_params: NotificationParams): Promise<void> {
    // Call your backend to send via Expo's push service
  }

  setupNotificationHandlers() {
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      if (data?.type === 'booking_confirmed' && data.booking_id) {
        // @ts-ignore - global navigation
        navigate('BookingDetail', { id: String(data.booking_id) });
      }
    });
  }
}

export const notificationService = new NotificationService();
