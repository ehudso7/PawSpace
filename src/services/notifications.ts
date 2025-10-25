import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from './supabase';
import { NotificationParams } from '../types';

class NotificationService {
  async registerForPushNotifications(): Promise<string | undefined> {
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
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: params.to,
          title: params.title,
          body: params.body,
          data: params.data,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
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
      if (data?.type === 'booking_confirmed') {
        navigation.navigate('BookingDetail', { id: data.booking_id });
      } else if (data?.type === 'new_follower') {
        navigation.navigate('Profile', { userId: data.user_id });
      } else if (data?.type === 'new_comment') {
        navigation.navigate('TransformationDetail', { id: data.transformation_id });
      }
    });
  }
  
  async scheduleBookingReminder(bookingId: string, scheduledDate: string) {
    const trigger = new Date(scheduledDate);
    trigger.setHours(trigger.getHours() - 2); // 2 hours before
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Booking Reminder',
        body: 'You have a pet transformation booking in 2 hours!',
        data: { booking_id: bookingId, type: 'booking_reminder' },
      },
      trigger,
    });
  }
  
  async cancelBookingReminder(bookingId: string) {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const reminder = scheduledNotifications.find(
      notification => notification.content.data?.booking_id === bookingId
    );
    
    if (reminder) {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    }
  }
}

export const notificationService = new NotificationService();
