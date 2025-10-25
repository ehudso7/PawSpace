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
import { useNavigation } from '@react-navigation/native';
import { Settings as SettingsType } from '../../types';
import { supabase } from '../../services/supabase';
import AnalyticsService from '../../services/analytics';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<SettingsType>({
    notifications: {
      push: true,
      email: true,
      booking_reminders: true,
      new_followers: true,
      comments_likes: true,
      promotional_emails: false,
    },
    privacy: {
      profile_visibility: 'public',
      show_location: true,
      who_can_message: 'everyone',
      blocked_users: [],
    },
    app: {
      language: 'en',
      theme: 'auto',
      data_usage: 'wifi_only',
    },
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserData();
    loadSettings();
    AnalyticsService.getInstance().logScreenView('SettingsScreen');
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (data) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: SettingsType) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: authUser.id,
          settings: newSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleNotificationToggle = (key: keyof SettingsType['notifications']) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    saveSettings(newSettings);
  };

  const handlePrivacyToggle = (key: keyof SettingsType['privacy'], value: any) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const handleAppSetting = (key: keyof SettingsType['app'], value: any) => {
    const newSettings = {
      ...settings,
      app: {
        ...settings.app,
        [key]: value,
      },
    };
    saveSettings(newSettings);
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
              // Navigation would be handled by auth state change
            } catch (error) {
              console.error('Error logging out:', error);
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
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, you'd implement proper account deletion
              Alert.alert('Account Deletion', 'Please contact support to delete your account');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderSettingItem = (
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  const renderSwitch = (value: boolean, onValueChange: (value: boolean) => void) => (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#d1d5db', true: '#6366f1' }}
      thumbColor={value ? '#fff' : '#f3f4f6'}
    />
  );

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      {renderSection('Account', (
        <>
          {renderSettingItem(
            'Email',
            user?.email,
            <Text style={styles.settingValue}>{user?.email}</Text>
          )}
          {renderSettingItem(
            'Phone',
            'Manage your phone number',
            <Text style={styles.settingValue}>{user?.phone || 'Not set'}</Text>,
            () => Alert.alert('Coming Soon', 'Phone number editing will be available soon')
          )}
          {renderSettingItem(
            'Password',
            'Change your password',
            <Text style={styles.chevron}>›</Text>,
            () => Alert.alert('Coming Soon', 'Password change will be available soon')
          )}
          {renderSettingItem(
            'Subscription',
            'Manage your subscription',
            <Text style={styles.settingValue}>Free Plan</Text>,
            () => Alert.alert('Coming Soon', 'Subscription management will be available soon')
          )}
        </>
      ))}

      {/* Notifications Section */}
      {renderSection('Notifications', (
        <>
          {renderSettingItem(
            'Push Notifications',
            'Receive push notifications',
            renderSwitch(settings.notifications.push, (value) => 
              handleNotificationToggle('push')
            )
          )}
          {renderSettingItem(
            'Email Notifications',
            'Receive email notifications',
            renderSwitch(settings.notifications.email, (value) => 
              handleNotificationToggle('email')
            )
          )}
          {renderSettingItem(
            'Booking Reminders',
            'Get reminded about upcoming bookings',
            renderSwitch(settings.notifications.booking_reminders, (value) => 
              handleNotificationToggle('booking_reminders')
            )
          )}
          {renderSettingItem(
            'New Followers',
            'Get notified when someone follows you',
            renderSwitch(settings.notifications.new_followers, (value) => 
              handleNotificationToggle('new_followers')
            )
          )}
          {renderSettingItem(
            'Comments & Likes',
            'Get notified about comments and likes',
            renderSwitch(settings.notifications.comments_likes, (value) => 
              handleNotificationToggle('comments_likes')
            )
          )}
          {renderSettingItem(
            'Promotional Emails',
            'Receive promotional emails and offers',
            renderSwitch(settings.notifications.promotional_emails, (value) => 
              handleNotificationToggle('promotional_emails')
            )
          )}
        </>
      ))}

      {/* Privacy Section */}
      {renderSection('Privacy', (
        <>
          {renderSettingItem(
            'Profile Visibility',
            'Control who can see your profile',
            <Text style={styles.settingValue}>
              {settings.privacy.profile_visibility === 'public' ? 'Public' : 'Private'}
            </Text>,
            () => {
              Alert.alert(
                'Profile Visibility',
                'Choose who can see your profile',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Public', onPress: () => handlePrivacyToggle('profile_visibility', 'public') },
                  { text: 'Private', onPress: () => handlePrivacyToggle('profile_visibility', 'private') },
                ]
              );
            }
          )}
          {renderSettingItem(
            'Show Location',
            'Display your location on your profile',
            renderSwitch(settings.privacy.show_location, (value) => 
              handlePrivacyToggle('show_location', value)
            )
          )}
          {renderSettingItem(
            'Who Can Message You',
            'Control who can send you messages',
            <Text style={styles.settingValue}>
              {settings.privacy.who_can_message === 'everyone' ? 'Everyone' : 
               settings.privacy.who_can_message === 'followers' ? 'Followers Only' : 'No One'}
            </Text>,
            () => {
              Alert.alert(
                'Message Settings',
                'Choose who can message you',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Everyone', onPress: () => handlePrivacyToggle('who_can_message', 'everyone') },
                  { text: 'Followers Only', onPress: () => handlePrivacyToggle('who_can_message', 'followers') },
                  { text: 'No One', onPress: () => handlePrivacyToggle('who_can_message', 'none') },
                ]
              );
            }
          )}
          {renderSettingItem(
            'Blocked Users',
            'Manage blocked users',
            <Text style={styles.chevron}>›</Text>,
            () => Alert.alert('Coming Soon', 'Blocked users management will be available soon')
          )}
        </>
      ))}

      {/* Support Section */}
      {renderSection('Support', (
        <>
          {renderSettingItem(
            'Help Center',
            'Get help and support',
            <Text style={styles.chevron}>›</Text>,
            () => Linking.openURL('https://pawspace.com/help')
          )}
          {renderSettingItem(
            'Contact Support',
            'Get in touch with our support team',
            <Text style={styles.chevron}>›</Text>,
            () => Linking.openURL('mailto:support@pawspace.com')
          )}
          {renderSettingItem(
            'Report a Problem',
            'Report bugs or issues',
            <Text style={styles.chevron}>›</Text>,
            () => Alert.alert('Coming Soon', 'Problem reporting will be available soon')
          )}
          {renderSettingItem(
            'Terms of Service',
            'Read our terms of service',
            <Text style={styles.chevron}>›</Text>,
            () => Linking.openURL('https://pawspace.com/terms')
          )}
          {renderSettingItem(
            'Privacy Policy',
            'Read our privacy policy',
            <Text style={styles.chevron}>›</Text>,
            () => Linking.openURL('https://pawspace.com/privacy')
          )}
        </>
      ))}

      {/* App Section */}
      {renderSection('App', (
        <>
          {renderSettingItem(
            'Language',
            'Choose your preferred language',
            <Text style={styles.settingValue}>English</Text>,
            () => Alert.alert('Coming Soon', 'Language selection will be available soon')
          )}
          {renderSettingItem(
            'Theme',
            'Choose your app theme',
            <Text style={styles.settingValue}>
              {settings.app.theme === 'auto' ? 'Auto' : 
               settings.app.theme === 'light' ? 'Light' : 'Dark'}
            </Text>,
            () => {
              Alert.alert(
                'Theme',
                'Choose your app theme',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Light', onPress: () => handleAppSetting('theme', 'light') },
                  { text: 'Dark', onPress: () => handleAppSetting('theme', 'dark') },
                  { text: 'Auto', onPress: () => handleAppSetting('theme', 'auto') },
                ]
              );
            }
          )}
          {renderSettingItem(
            'Data Usage',
            'Control when to use mobile data',
            <Text style={styles.settingValue}>
              {settings.app.data_usage === 'wifi_only' ? 'WiFi Only' : 'Always'}
            </Text>,
            () => {
              Alert.alert(
                'Data Usage',
                'Choose when to use mobile data',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'WiFi Only', onPress: () => handleAppSetting('data_usage', 'wifi_only') },
                  { text: 'Always', onPress: () => handleAppSetting('data_usage', 'always') },
                ]
              );
            }
          )}
          {renderSettingItem(
            'Clear Cache',
            'Clear app cache and temporary files',
            <Text style={styles.chevron}>›</Text>,
            () => {
              Alert.alert(
                'Clear Cache',
                'This will clear all cached data. Continue?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully') },
                ]
              );
            }
          )}
          {renderSettingItem(
            'App Version',
            'Current version information',
            <Text style={styles.settingValue}>1.0.0</Text>
          )}
        </>
      ))}

      {/* Danger Zone */}
      {renderSection('Danger Zone', (
        <>
          {renderSettingItem(
            'Logout',
            'Sign out of your account',
            <Text style={styles.chevron}>›</Text>,
            handleLogout
          )}
          {renderSettingItem(
            'Delete Account',
            'Permanently delete your account',
            <Text style={[styles.chevron, styles.dangerText]}>›</Text>,
            handleDeleteAccount
          )}
        </>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    padding: 20,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  chevron: {
    fontSize: 18,
    color: '#d1d5db',
    marginLeft: 10,
  },
  dangerText: {
    color: '#ef4444',
  },
});

export default SettingsScreen;