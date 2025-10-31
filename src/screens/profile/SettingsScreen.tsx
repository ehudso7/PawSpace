import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '@/constants/theme';
import Button from '@/components/common/Button';

type Props = NativeStackScreenProps<any, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear cache implementation
            Alert.alert('Success', 'Cache cleared successfully');
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
            // TODO: Delete account implementation
            Alert.alert('Account Deletion', 'Please contact support to delete your account.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>Receive push notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>

        {notificationsEnabled && (
          <>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive email updates</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive push alerts</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingDescription}>View our privacy policy</Text>
          </View>
          <Text style={styles.settingArrow}>?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Text style={styles.settingDescription}>View terms and conditions</Text>
          </View>
          <Text style={styles.settingArrow}>?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={handleClearCache}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Clear Cache</Text>
            <Text style={styles.settingDescription}>Clear cached data</Text>
          </View>
          <Text style={styles.settingArrow}>?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>App Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Help & Support</Text>
          <Text style={styles.settingArrow}>?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingLabel}>Contact Us</Text>
          <Text style={styles.settingArrow}>?</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Delete Account"
        onPress={handleDeleteAccount}
        variant="outline"
        style={[styles.deleteButton, { borderColor: theme.colors.error }]}
        textStyle={{ color: theme.colors.error }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  settingValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  settingArrow: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    marginLeft: 16,
  },
  deleteButton: {
    marginTop: 24,
  },
});

export default SettingsScreen;