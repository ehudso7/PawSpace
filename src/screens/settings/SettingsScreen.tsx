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
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList, User, NotificationSettings, PrivacySettings, AppSettings } from '../../types';
import { supabase } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export default function SettingsScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Settings states
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    push_notifications: true,
    email_notifications: true,
    booking_reminders: true,
    new_followers: true,
    comments_likes: true,
    promotional_emails: false,
  });
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profile_visibility: 'public',
    show_location: true,
    who_can_message: 'everyone',
    blocked_users: [],
  });
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    language: 'en',
    theme: 'auto',
    data_usage: 'medium',
  });

  useEffect(() => {
    loadUserAndSettings();
  }, []);

  const loadUserAndSettings = async () => {
    try {
      setLoading(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigation.goBack();
        return;
      }

      // Load user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (userError) throw userError;
      setUser(userData);

      // Load settings from AsyncStorage
      const [notificationData, privacyData, appData] = await Promise.all([
        AsyncStorage.getItem('notification_settings'),
        AsyncStorage.getItem('privacy_settings'),
        AsyncStorage.getItem('app_settings'),
      ]);

      if (notificationData) {
        setNotificationSettings(JSON.parse(notificationData));
      }
      if (privacyData) {
        setPrivacySettings(JSON.parse(privacyData));
      }
      if (appData) {
        setAppSettings(JSON.parse(appData));
      }

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'SettingsScreen.loadUserAndSettings');
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      setNotificationSettings(newSettings);
      await AsyncStorage.setItem('notification_settings', JSON.stringify(newSettings));
      
      // Update user preferences in Supabase
      await supabase
        .from('users')
        .update({ notification_preferences: newSettings })
        .eq('id', user?.id);
        
    } catch (error) {
      errorTrackingService.captureException(error as Error, 'SettingsScreen.saveNotificationSettings');
    }
  };

  const savePrivacySettings = async (newSettings: PrivacySettings) => {
    try {
      setPrivacySettings(newSettings);
      await AsyncStorage.setItem('privacy_settings', JSON.stringify(newSettings));
      
      // Update user preferences in Supabase
      await supabase
        .from('users')
        .update({ privacy_preferences: newSettings })
        .eq('id', user?.id);
        
    } catch (error) {
      errorTrackingService.captureException(error as Error, 'SettingsScreen.savePrivacySettings');
    }
  };

  const saveAppSettings = async (newSettings: AppSettings) => {
    try {
      setAppSettings(newSettings);
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
    } catch (error) {
      errorTrackingService.captureException(error as Error, 'SettingsScreen.saveAppSettings');
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
              // Navigate to login screen or reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              errorTrackingService.captureException(error as Error, 'SettingsScreen.handleLogout');
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
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Type "DELETE" to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  onPress: async () => {
                    try {
                      // Delete user data from Supabase
                      await supabase
                        .from('users')
                        .delete()
                        .eq('id', user?.id);
                      
                      await supabase.auth.signOut();
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    } catch (error) {
                      errorTrackingService.captureException(error as Error, 'SettingsScreen.handleDeleteAccount');
                      Alert.alert('Error', 'Failed to delete account');
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

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and may improve app performance.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              // Clear AsyncStorage cache
              const keys = await AsyncStorage.getAllKeys();
              await AsyncStorage.multiRemove(keys);
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              errorTrackingService.captureException(error as Error, 'SettingsScreen.clearCache');
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => {
      errorTrackingService.captureException(err as Error, 'SettingsScreen.openURL');
      Alert.alert('Error', 'Failed to open link');
    });
  };

  const renderSettingItem = (
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    showArrow = true
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
      <View style={styles.settingRight}>
        {rightElement}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSwitchItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#f0f0f0', true: '#007AFF' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
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
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Account Section */}
        {renderSection('Account', (
          <>
            {renderSettingItem(
              'Email',
              user?.email,
              undefined,
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            )}
            {renderSettingItem(
              'Phone',
              user?.phone || 'Not provided',
              () => navigation.navigate('EditProfile')
            )}
            {renderSettingItem(
              'Password',
              'Change password',
              () => {
                // Navigate to change password screen
                Alert.alert('Change Password', 'Password change functionality would be implemented here');
              }
            )}
            {renderSettingItem(
              'Subscription',
              'Free Plan',
              () => {
                // Navigate to subscription screen
                Alert.alert('Subscription', 'Subscription management would be implemented here');
              }
            )}
          </>
        ))}

        {/* Notifications Section */}
        {renderSection('Notifications', (
          <>
            {renderSwitchItem(
              'Push Notifications',
              'Receive push notifications',
              notificationSettings.push_notifications,
              (value) => saveNotificationSettings({ ...notificationSettings, push_notifications: value })
            )}
            {renderSwitchItem(
              'Email Notifications',
              'Receive email notifications',
              notificationSettings.email_notifications,
              (value) => saveNotificationSettings({ ...notificationSettings, email_notifications: value })
            )}
            {renderSwitchItem(
              'Booking Reminders',
              'Get reminded about upcoming bookings',
              notificationSettings.booking_reminders,
              (value) => saveNotificationSettings({ ...notificationSettings, booking_reminders: value })
            )}
            {renderSwitchItem(
              'New Followers',
              'Get notified when someone follows you',
              notificationSettings.new_followers,
              (value) => saveNotificationSettings({ ...notificationSettings, new_followers: value })
            )}
            {renderSwitchItem(
              'Comments & Likes',
              'Get notified about comments and likes',
              notificationSettings.comments_likes,
              (value) => saveNotificationSettings({ ...notificationSettings, comments_likes: value })
            )}
            {renderSwitchItem(
              'Promotional Emails',
              'Receive promotional emails and updates',
              notificationSettings.promotional_emails,
              (value) => saveNotificationSettings({ ...notificationSettings, promotional_emails: value })
            )}
          </>
        ))}

        {/* Privacy Section */}
        {renderSection('Privacy', (
          <>
            {renderSettingItem(
              'Profile Visibility',
              privacySettings.profile_visibility === 'public' ? 'Public' : 'Private',
              () => {
                Alert.alert(
                  'Profile Visibility',
                  'Choose who can see your profile',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Public',
                      onPress: () => savePrivacySettings({ ...privacySettings, profile_visibility: 'public' })
                    },
                    {
                      text: 'Private',
                      onPress: () => savePrivacySettings({ ...privacySettings, profile_visibility: 'private' })
                    },
                  ]
                );
              }
            )}
            {renderSwitchItem(
              'Show Location',
              'Display your location on your profile',
              privacySettings.show_location,
              (value) => savePrivacySettings({ ...privacySettings, show_location: value })
            )}
            {renderSettingItem(
              'Who Can Message You',
              privacySettings.who_can_message === 'everyone' ? 'Everyone' : 
              privacySettings.who_can_message === 'followers' ? 'Followers Only' : 'No One',
              () => {
                Alert.alert(
                  'Who Can Message You',
                  'Choose who can send you messages',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Everyone',
                      onPress: () => savePrivacySettings({ ...privacySettings, who_can_message: 'everyone' })
                    },
                    {
                      text: 'Followers Only',
                      onPress: () => savePrivacySettings({ ...privacySettings, who_can_message: 'followers' })
                    },
                    {
                      text: 'No One',
                      onPress: () => savePrivacySettings({ ...privacySettings, who_can_message: 'none' })
                    },
                  ]
                );
              }
            )}
            {renderSettingItem(
              'Blocked Users',
              `${privacySettings.blocked_users.length} blocked users`,
              () => {
                // Navigate to blocked users screen
                Alert.alert('Blocked Users', 'Blocked users management would be implemented here');
              }
            )}
          </>
        ))}

        {/* Support Section */}
        {renderSection('Support', (
          <>
            {renderSettingItem(
              'Help Center',
              'Get help and find answers',
              () => navigation.navigate('HelpCenter')
            )}
            {renderSettingItem(
              'Contact Support',
              'Send us a message',
              () => navigation.navigate('ContactSupport')
            )}
            {renderSettingItem(
              'Report a Problem',
              'Report bugs or issues',
              () => {
                Alert.alert('Report Problem', 'Problem reporting functionality would be implemented here');
              }
            )}
            {renderSettingItem(
              'Terms of Service',
              'Read our terms',
              () => navigation.navigate('TermsOfService')
            )}
            {renderSettingItem(
              'Privacy Policy',
              'Read our privacy policy',
              () => navigation.navigate('PrivacyPolicy')
            )}
          </>
        ))}

        {/* App Section */}
        {renderSection('App', (
          <>
            {renderSettingItem(
              'Language',
              appSettings.language === 'en' ? 'English' : 'Other',
              () => {
                Alert.alert('Language', 'Language selection would be implemented here');
              }
            )}
            {renderSettingItem(
              'Theme',
              appSettings.theme === 'auto' ? 'Auto' : 
              appSettings.theme === 'light' ? 'Light' : 'Dark',
              () => {
                Alert.alert(
                  'Theme',
                  'Choose your preferred theme',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Light',
                      onPress: () => saveAppSettings({ ...appSettings, theme: 'light' })
                    },
                    {
                      text: 'Dark',
                      onPress: () => saveAppSettings({ ...appSettings, theme: 'dark' })
                    },
                    {
                      text: 'Auto',
                      onPress: () => saveAppSettings({ ...appSettings, theme: 'auto' })
                    },
                  ]
                );
              }
            )}
            {renderSettingItem(
              'Data Usage',
              appSettings.data_usage === 'low' ? 'Low' : 
              appSettings.data_usage === 'medium' ? 'Medium' : 'High',
              () => {
                Alert.alert(
                  'Data Usage',
                  'Choose your data usage preference',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Low',
                      onPress: () => saveAppSettings({ ...appSettings, data_usage: 'low' })
                    },
                    {
                      text: 'Medium',
                      onPress: () => saveAppSettings({ ...appSettings, data_usage: 'medium' })
                    },
                    {
                      text: 'High',
                      onPress: () => saveAppSettings({ ...appSettings, data_usage: 'high' })
                    },
                  ]
                );
              }
            )}
            {renderSettingItem(
              'Clear Cache',
              'Free up storage space',
              clearCache
            )}
            {renderSettingItem(
              'App Version',
              '1.0.0',
              undefined,
              undefined,
              false
            )}
          </>
        ))}

        {/* Danger Zone */}
        {renderSection('Danger Zone', (
          <>
            {renderSettingItem(
              'Logout',
              'Sign out of your account',
              handleLogout,
              undefined,
              false
            )}
            {renderSettingItem(
              'Delete Account',
              'Permanently delete your account',
              handleDeleteAccount,
              undefined,
              false
            )}
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
