import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from './supabase';

interface NotificationParams {
  to: string; // Push token
  title: string;
  body: string;
  data?: any;
}

class NotificationService {
  async registerForPushNotifications(): Promise<string | undefined> {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.error('Failed to get push token for push notification!');
      return;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Save token to user's profile in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase
        .from('users')
        .update({ push_token: token })
        .eq('id', user.id);
    }
    
    return token;
  }
  
  async sendNotification(params: NotificationParams): Promise<void> {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: params.to,
          sound: 'default',
          title: params.title,
          body: params.body,
          data: params.data,
        }),
      });
      
      const result = await response.json();
      console.log('Notification sent:', result);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
  
  setupNotificationHandlers(navigation: any) {
    // Handle notifications received while app is foregrounded
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    // Handle notification tap
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      // Navigate based on notification type
      if (data.type === 'booking_confirmed') {
        navigation.navigate('BookingDetail', { id: data.booking_id });
      } else if (data.type === 'new_follower') {
        navigation.navigate('Profile', { userId: data.user_id });
      } else if (data.type === 'comment') {
        navigation.navigate('TransformationDetail', { id: data.post_id });
      } else if (data.type === 'like') {
        navigation.navigate('TransformationDetail', { id: data.post_id });
      } else if (data.type === 'message') {
        navigation.navigate('Chat', { conversationId: data.conversation_id });
      }
    });
  }
  
  async scheduleLocalNotification(title: string, body: string, data?: any, delay: number = 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: delay > 0 ? { seconds: delay } : null,
    });
  }
  
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
  
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }
  
  async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }
}

export const notificationService = new NotificationService();
export type { NotificationParams };
