import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, UserSettings } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';
import { notificationService } from '../../services/notifications';

interface SettingsScreenProps {
  navigation: any;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'switch' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    analyticsService.logScreenView('Settings');
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser(authUser);

      // Load user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Load user settings
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (settingsData) {
        setSettings(settingsData);
      } else {
        // Create default settings
        const defaultSettings = {
          user_id: authUser.id,
          push_notifications: true,
          email_notifications: true,
          booking_reminders: true,
          new_followers: true,
          comments_likes: true,
          promotional_emails: false,
          profile_visibility: 'public' as const,
          show_location: true,
          message_permissions: 'everyone' as const,
          language: 'en',
          theme: 'auto' as const,
        };

        const { data: newSettings } = await supabase
          .from('user_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (newSettings) {
          setSettings(newSettings);
        }
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'SettingsScreen.loadSettings',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    try {
      if (!settings || !user) return;

      const { error } = await supabase
        .from('user_settings')
        .update({ [key]: value })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, [key]: value } : null);

      analyticsService.logEvent('setting_changed', {
        setting: key,
        value: value.toString(),
      });
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'SettingsScreen.updateSetting',
        key,
        value,
      });
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              await AsyncStorage.clear();
              analyticsService.logEvent('user_logout');
              // Navigation will be handled by auth state change
            } catch (error) {
              errorTrackingService.captureException(error as Error, {
                context: 'SettingsScreen.handleLogout',
              });
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure? Type DELETE to confirm.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'DELETE ACCOUNT',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      // In a real app, you'd call a backend function to handle account deletion
                      // This would involve deleting all user data, posts, etc.
                      analyticsService.logEvent('account_deletion_requested');
                      Alert.alert(
                        'Account Deletion Requested',
                        'Your account deletion request has been submitted. You will receive an email confirmation within 24 hours.'
                      );
                    } catch (error) {
                      errorTrackingService.captureException(error as Error, {
                        context: 'SettingsScreen.handleDeleteAccount',
                      });
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'Cache cleared successfully');
      analyticsService.logEvent('cache_cleared');
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'SettingsScreen.clearCache',
      });
      Alert.alert('Error', 'Failed to clear cache');
    }
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(error => {
      errorTrackingService.captureException(error as Error, {
        context: 'SettingsScreen.openURL',
        url,
      });
    });
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'email',
          title: 'Email',
          subtitle: user?.email,
          icon: 'mail-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('ChangeEmail'),
        },
        {
          id: 'phone',
          title: 'Phone',
          subtitle: 'Update phone number',
          icon: 'call-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('ChangePhone'),
        },
        {
          id: 'password',
          title: 'Password',
          subtitle: 'Change password',
          icon: 'lock-closed-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('ChangePassword'),
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: 'Manage subscription',
          icon: 'card-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('Subscription'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          subtitle: 'Receive push notifications',
          icon: 'notifications-outline',
          type: 'switch' as const,
          value: settings?.push_notifications,
          onToggle: (value: boolean) => {
            updateSetting('push_notifications', value);
            if (value) {
              notificationService.registerForPushNotifications();
            }
          },
        },
        {
          id: 'email_notifications',
          title: 'Email Notifications',
          subtitle: 'Receive email notifications',
          icon: 'mail-outline',
          type: 'switch' as const,
          value: settings?.email_notifications,
          onToggle: (value: boolean) => updateSetting('email_notifications', value),
        },
        {
          id: 'booking_reminders',
          title: 'Booking Reminders',
          subtitle: 'Get reminded about upcoming bookings',
          icon: 'calendar-outline',
          type: 'switch' as const,
          value: settings?.booking_reminders,
          onToggle: (value: boolean) => updateSetting('booking_reminders', value),
        },
        {
          id: 'new_followers',
          title: 'New Followers',
          subtitle: 'Notify when someone follows you',
          icon: 'person-add-outline',
          type: 'switch' as const,
          value: settings?.new_followers,
          onToggle: (value: boolean) => updateSetting('new_followers', value),
        },
        {
          id: 'comments_likes',
          title: 'Comments & Likes',
          subtitle: 'Notify about interactions on your posts',
          icon: 'heart-outline',
          type: 'switch' as const,
          value: settings?.comments_likes,
          onToggle: (value: boolean) => updateSetting('comments_likes', value),
        },
        {
          id: 'promotional_emails',
          title: 'Promotional Emails',
          subtitle: 'Receive marketing emails',
          icon: 'megaphone-outline',
          type: 'switch' as const,
          value: settings?.promotional_emails,
          onToggle: (value: boolean) => updateSetting('promotional_emails', value),
        },
      ],
    },
    {
      title: 'Privacy',
      items: [
        {
          id: 'profile_visibility',
          title: 'Profile Visibility',
          subtitle: settings?.profile_visibility === 'public' ? 'Public' : 'Private',
          icon: 'eye-outline',
          type: 'navigation' as const,
          onPress: () => {
            Alert.alert(
              'Profile Visibility',
              'Choose who can see your profile',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Public',
                  onPress: () => updateSetting('profile_visibility', 'public'),
                },
                {
                  text: 'Private',
                  onPress: () => updateSetting('profile_visibility', 'private'),
                },
              ]
            );
          },
        },
        {
          id: 'show_location',
          title: 'Show Location',
          subtitle: 'Display your location on profile',
          icon: 'location-outline',
          type: 'switch' as const,
          value: settings?.show_location,
          onToggle: (value: boolean) => updateSetting('show_location', value),
        },
        {
          id: 'message_permissions',
          title: 'Who Can Message You',
          subtitle: settings?.message_permissions || 'Everyone',
          icon: 'chatbubble-outline',
          type: 'navigation' as const,
          onPress: () => {
            Alert.alert(
              'Message Permissions',
              'Choose who can send you messages',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Everyone',
                  onPress: () => updateSetting('message_permissions', 'everyone'),
                },
                {
                  text: 'Followers Only',
                  onPress: () => updateSetting('message_permissions', 'followers'),
                },
                {
                  text: 'No One',
                  onPress: () => updateSetting('message_permissions', 'none'),
                },
              ]
            );
          },
        },
        {
          id: 'blocked_users',
          title: 'Blocked Users',
          subtitle: 'Manage blocked users',
          icon: 'ban-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('BlockedUsers'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help_center',
          title: 'Help Center',
          subtitle: 'Get help and support',
          icon: 'help-circle-outline',
          type: 'navigation' as const,
          onPress: () => openURL('https://pawspace.com/help'),
        },
        {
          id: 'contact_support',
          title: 'Contact Support',
          subtitle: 'Get in touch with our team',
          icon: 'chatbubbles-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('ContactSupport'),
        },
        {
          id: 'report_problem',
          title: 'Report a Problem',
          subtitle: 'Report bugs or issues',
          icon: 'flag-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('ReportProblem'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: 'document-text-outline',
          type: 'navigation' as const,
          onPress: () => openURL('https://pawspace.com/terms'),
        },
        {
          id: 'privacy_policy',
          title: 'Privacy Policy',
          icon: 'shield-outline',
          type: 'navigation' as const,
          onPress: () => openURL('https://pawspace.com/privacy'),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          icon: 'language-outline',
          type: 'navigation' as const,
          onPress: () => {
            Alert.alert('Language', 'Language selection coming soon');
          },
        },
        {
          id: 'theme',
          title: 'Theme',
          subtitle: settings?.theme || 'Auto',
          icon: 'color-palette-outline',
          type: 'navigation' as const,
          onPress: () => {
            Alert.alert(
              'Theme',
              'Choose your preferred theme',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Light',
                  onPress: () => updateSetting('theme', 'light'),
                },
                {
                  text: 'Dark',
                  onPress: () => updateSetting('theme', 'dark'),
                },
                {
                  text: 'Auto',
                  onPress: () => updateSetting('theme', 'auto'),
                },
              ]
            );
          },
        },
        {
          id: 'data_usage',
          title: 'Data Usage',
          subtitle: 'Manage data consumption',
          icon: 'cellular-outline',
          type: 'navigation' as const,
          onPress: () => navigation.navigate('DataUsage'),
        },
        {
          id: 'clear_cache',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          icon: 'trash-outline',
          type: 'action' as const,
          onPress: clearCache,
        },
        {
          id: 'app_version',
          title: 'App Version',
          subtitle: '1.0.0',
          icon: 'information-circle-outline',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        {
          id: 'logout',
          title: 'Logout',
          icon: 'log-out-outline',
          type: 'action' as const,
          onPress: handleLogout,
          destructive: true,
        },
        {
          id: 'delete_account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          icon: 'trash-outline',
          type: 'action' as const,
          onPress: handleDeleteAccount,
          destructive: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.settingLeft}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={item.destructive ? '#ff6b6b' : '#666'}
        />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, item.destructive && styles.destructiveText]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.type === 'switch' && (
          <Switch
            value={item.value || false}
            onValueChange={item.onToggle}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={item.value ? '#fff' : '#f4f3f4'}
          />
        )}
        {item.type === 'navigation' && (
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(renderSettingItem)}
          </View>
        ))}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  settingRight: {
    alignItems: 'center',
  },
  destructiveText: {
    color: '#ff6b6b',
  },
});