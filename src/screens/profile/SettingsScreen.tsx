import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { Button } from '@/components/common';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    locationServices: true,
    analytics: true,
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy content would go here.');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service content would go here.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support at support@pawspace.com');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Implement account deletion
          Alert.alert('Account Deleted', 'Your account has been deleted.');
        }},
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>All Notifications</Text>
            <Text style={styles.settingDescription}>Enable all app notifications</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => handleSettingChange('notifications', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={settings.notifications ? theme.colors.primary : theme.colors.gray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive push notifications</Text>
          </View>
          <Switch
            value={settings.pushNotifications}
            onValueChange={(value) => handleSettingChange('pushNotifications', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={settings.pushNotifications ? theme.colors.primary : theme.colors.gray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Email Notifications</Text>
            <Text style={styles.settingDescription}>Receive email updates</Text>
          </View>
          <Switch
            value={settings.emailNotifications}
            onValueChange={(value) => handleSettingChange('emailNotifications', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={settings.emailNotifications ? theme.colors.primary : theme.colors.gray}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Location Services</Text>
            <Text style={styles.settingDescription}>Allow location access for nearby services</Text>
          </View>
          <Switch
            value={settings.locationServices}
            onValueChange={(value) => handleSettingChange('locationServices', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={settings.locationServices ? theme.colors.primary : theme.colors.gray}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Analytics</Text>
            <Text style={styles.settingDescription}>Help improve the app with usage data</Text>
          </View>
          <Switch
            value={settings.analytics}
            onValueChange={(value) => handleSettingChange('analytics', value)}
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor={settings.analytics ? theme.colors.primary : theme.colors.gray}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        
        <Button
          title="Privacy Policy"
          onPress={handlePrivacy}
          variant="outline"
          style={styles.legalButton}
        />
        
        <Button
          title="Terms of Service"
          onPress={handleTerms}
          variant="outline"
          style={styles.legalButton}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Button
          title="Contact Support"
          onPress={handleSupport}
          variant="outline"
          style={styles.supportButton}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          variant="outline"
          style={styles.deleteButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fonts['3xl'],
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: theme.colors.textSecondary,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fonts.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.fonts.md,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.fonts.sm,
    color: theme.colors.textSecondary,
  },
  legalButton: {
    marginBottom: theme.spacing.sm,
  },
  supportButton: {
    marginBottom: theme.spacing.sm,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
});

export default SettingsScreen;