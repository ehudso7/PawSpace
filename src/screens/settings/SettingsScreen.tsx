import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '@/services/supabase';
import { useAuthUser } from '@/hooks/useCurrentUser';
import { UserSettings } from '@/types';

const SettingsRow: React.FC<{ title: string; right?: React.ReactNode; onPress?: () => void }>
  = ({ title, right, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.6 : 1}>
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{title}</Text>
      {right}
    </View>
  </TouchableOpacity>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const SettingsScreen: React.FC = () => {
  const userId = useAuthUser();
  const [settings, setSettings] = useState<UserSettings | undefined>(undefined);

  useEffect(() => {
    async function load() {
      if (!userId) return;
      const { data } = await supabase.from('settings').select('*').eq('id', userId).single();
      if (data) {
        const s: UserSettings = data;
        setSettings(s);
      } else {
        const s: UserSettings = {
          id: userId,
          account: { email: '', phone: undefined, subscriptionStatus: 'free' },
          notifications: { push: true, email: true, bookingReminders: true, newFollowers: true, commentsLikes: true, promotions: false },
          privacy: { profileVisibility: 'public', showLocation: true, whoCanMessage: 'everyone', blockedUsers: [] },
          app: { language: 'en', theme: 'auto', appVersion: (Constants.expoConfig?.extra as any)?.appVersion ?? '1.0.0' },
        };
        setSettings(s);
      }
    }
    load();
  }, [userId]);

  async function save(partial: Partial<UserSettings>) {
    if (!userId || !settings) return;
    const next = { ...settings, ...partial } as UserSettings;
    setSettings(next);
    await supabase.from('settings').upsert(next);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle title="Account" />
      <SettingsRow title={`Email: ${settings?.account.email ?? ''}`} />
      <SettingsRow title={`Phone: ${settings?.account.phone ?? ''}`} />
      <SettingsRow title={`Subscription: ${settings?.account.subscriptionStatus ?? 'free'}`} onPress={() => Alert.alert('Subscription', 'Upgrade flow not implemented.')} />
      <SettingsRow title="Change password" onPress={() => Alert.alert('Password', 'Change password flow not implemented.')} />

      <SectionTitle title="Notifications" />
      <SettingsRow title="Push notifications" right={<Switch value={!!settings?.notifications.push} onValueChange={(v) => save({ notifications: { ...settings!.notifications, push: v } })} />} />
      <SettingsRow title="Email notifications" right={<Switch value={!!settings?.notifications.email} onValueChange={(v) => save({ notifications: { ...settings!.notifications, email: v } })} />} />
      <SettingsRow title="Booking reminders" right={<Switch value={!!settings?.notifications.bookingReminders} onValueChange={(v) => save({ notifications: { ...settings!.notifications, bookingReminders: v } })} />} />
      <SettingsRow title="New followers" right={<Switch value={!!settings?.notifications.newFollowers} onValueChange={(v) => save({ notifications: { ...settings!.notifications, newFollowers: v } })} />} />
      <SettingsRow title="Comments/likes" right={<Switch value={!!settings?.notifications.commentsLikes} onValueChange={(v) => save({ notifications: { ...settings!.notifications, commentsLikes: v } })} />} />
      <SettingsRow title="Promotional emails" right={<Switch value={!!settings?.notifications.promotions} onValueChange={(v) => save({ notifications: { ...settings!.notifications, promotions: v } })} />} />

      <SectionTitle title="Privacy" />
      <SettingsRow title={`Profile visibility: ${settings?.privacy.profileVisibility ?? 'public'}`} onPress={() => Alert.alert('Visibility', 'Change via web settings for now.')} />
      <SettingsRow title="Show location" right={<Switch value={!!settings?.privacy.showLocation} onValueChange={(v) => save({ privacy: { ...settings!.privacy, showLocation: v } })} />} />
      <SettingsRow title={`Who can message you: ${settings?.privacy.whoCanMessage ?? 'everyone'}`} onPress={() => Alert.alert('Messaging', 'Change via web settings for now.')} />
      <SettingsRow title={`Blocked users: ${settings?.privacy.blockedUsers?.length ?? 0}`} onPress={() => Alert.alert('Blocked users', 'Manage via web settings for now.')} />

      <SectionTitle title="Support" />
      <SettingsRow title="Help center" onPress={() => Alert.alert('Help', 'Open Help Center URL.')} />
      <SettingsRow title="Contact support" onPress={() => Alert.alert('Support', 'Email support@petcare.example')} />
      <SettingsRow title="Report a problem" onPress={() => Alert.alert('Report', 'Open bug report form.')} />
      <SettingsRow title="Terms of service" onPress={() => Alert.alert('Terms', 'Open ToS URL.')} />
      <SettingsRow title="Privacy policy" onPress={() => Alert.alert('Privacy', 'Open Privacy Policy URL.')} />

      <SectionTitle title="App" />
      <SettingsRow title={`Language: ${settings?.app.language ?? 'en'}`} onPress={() => Alert.alert('Language', 'Language chooser not implemented.')} />
      <SettingsRow title={`Theme: ${settings?.app.theme ?? 'auto'}`} onPress={() => Alert.alert('Theme', 'Theme switch in system settings.')} />
      <SettingsRow title="Data usage" onPress={() => Alert.alert('Data', 'Data saver setting not implemented.')} />
      <SettingsRow title="Clear cache" onPress={() => Alert.alert('Cache', 'Cleared.')} />
      <SettingsRow title={`App version: ${(Constants.expoConfig?.extra as any)?.appVersion ?? '1.0.0'}`} />

      <SectionTitle title="Danger Zone" />
      <SettingsRow title="Logout" onPress={() => supabase.auth.signOut()} />
      <SettingsRow title="Delete account" onPress={() => Alert.alert('Delete account', 'Contact support to delete your account.')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 13, color: '#666', marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  rowTitle: { fontSize: 16 },
});

export default SettingsScreen;
