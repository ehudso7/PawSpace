import React, { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';

export default function SettingsScreen() {
  const [email] = useState('alex@example.com');
  const [phone, setPhone] = useState('');
  const [subscriptionStatus] = useState<'free' | 'pro' | 'trial' | 'expired'>('free');

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [commentsLikes, setCommentsLikes] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);

  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [showLocation, setShowLocation] = useState(true);
  const [whoCanMessage, setWhoCanMessage] = useState<'everyone' | 'followers' | 'no_one'>('everyone');
  const [blockedUsers] = useState<string[]>([]);

  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [dataUsage, setDataUsage] = useState<'low' | 'balanced' | 'high'>('balanced');

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Section title="Account">
        <Row label="Email" value={email} />
        <Row label="Phone" value={phone} onPress={() => setPhone(phone === '' ? '+1 555-0100' : '')} />
        <Row label="Password" value="Change" onPress={() => Alert.alert('Change password')} />
        <Row label="Subscription" value={subscriptionStatus.toUpperCase()} />
      </Section>

      <Section title="Notifications">
        <ToggleRow label="Push notifications" value={pushNotifications} onValueChange={setPushNotifications} />
        <ToggleRow label="Email notifications" value={emailNotifications} onValueChange={setEmailNotifications} />
        <ToggleRow label="Booking reminders" value={bookingReminders} onValueChange={setBookingReminders} />
        <ToggleRow label="New followers" value={newFollowers} onValueChange={setNewFollowers} />
        <ToggleRow label="Comments/likes" value={commentsLikes} onValueChange={setCommentsLikes} />
        <ToggleRow label="Promotional emails" value={promotionalEmails} onValueChange={setPromotionalEmails} />
      </Section>

      <Section title="Privacy">
        <Row label="Profile visibility" value={profileVisibility === 'public' ? 'Public' : 'Private'} onPress={() => setProfileVisibility(profileVisibility === 'public' ? 'private' : 'public')} />
        <ToggleRow label="Show location" value={showLocation} onValueChange={setShowLocation} />
        <Row label="Who can message you" value={whoCanMessage} onPress={() => setWhoCanMessage(whoCanMessage === 'everyone' ? 'followers' : whoCanMessage === 'followers' ? 'no_one' : 'everyone')} />
        <Row label="Blocked users" value={`${blockedUsers.length}`} onPress={() => Alert.alert('Blocked users')} />
      </Section>

      <Section title="Support">
        <Link label="Help center" onPress={() => Alert.alert('Help center')} />
        <Link label="Contact support" onPress={() => Alert.alert('Contact support')} />
        <Link label="Report a problem" onPress={() => Alert.alert('Report a problem')} />
        <Link label="Terms of service" onPress={() => Alert.alert('Terms of service')} />
        <Link label="Privacy policy" onPress={() => Alert.alert('Privacy policy')} />
      </Section>

      <Section title="App">
        <Row label="Language" value={language} onPress={() => setLanguage(language === 'English' ? 'Spanish' : 'English')} />
        <Row label="Theme" value={theme} onPress={() => setTheme(theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto')} />
        <Row label="Data usage" value={dataUsage} onPress={() => setDataUsage(dataUsage === 'balanced' ? 'low' : dataUsage === 'low' ? 'high' : 'balanced')} />
        <Link label="Clear cache" onPress={() => Alert.alert('Cache cleared')} />
        <Row label="App version" value="1.0.0" />
      </Section>

      <Section title="Danger Zone">
        <Pressable style={[styles.btn, styles.outline]} onPress={() => Alert.alert('Logged out')}>
          <Text style={[styles.btnText, { color: '#ef4444' }]}>Logout</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.danger]} onPress={() => Alert.alert('Account deleted')}>
          <Text style={[styles.btnText, { color: '#fff' }]}>Delete account</Text>
        </Pressable>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={styles.section}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
    </Pressable>
  );
}

function Link({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.label, { color: '#007AFF' }]}>{label}</Text>
    </Pressable>
  );
}

function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  card: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, overflow: 'hidden' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f3f4f6' },
  label: { fontWeight: '600' },
  value: { color: '#666' },
  btn: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  outline: { borderWidth: 1, borderColor: '#ef4444' },
  danger: { backgroundColor: '#ef4444' },
});
