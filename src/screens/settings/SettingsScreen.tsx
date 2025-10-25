import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Switch, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { analytics } from '@/services/analytics';

export function SettingsScreen() {
  const { user } = useAuth();

  const [push, setPush] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [commentsLikes, setCommentsLikes] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [showLocation, setShowLocation] = useState(true);
  const [whoCanMessage, setWhoCanMessage] = useState<'everyone' | 'followers' | 'none'>('everyone');

  useEffect(() => {
    analytics.logScreenView('Settings');
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Account</Text>
      <View style={{ paddingVertical: 8 }}>
        <Text>Email: {user ? 'on file' : '-'}</Text>
        <Text>Phone: —</Text>
        <TouchableOpacity style={{ marginTop: 8 }}><Text style={{ color: '#007AFF' }}>Change Password</Text></TouchableOpacity>
        <Text style={{ marginTop: 8 }}>Subscription: Free</Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Notifications</Text>
      <Row label="Push notifications" value={push} onValueChange={setPush} />
      <Row label="Email notifications" value={emailNotif} onValueChange={setEmailNotif} />
      <Row label="Booking reminders" value={bookingReminders} onValueChange={setBookingReminders} />
      <Row label="New followers" value={newFollowers} onValueChange={setNewFollowers} />
      <Row label="Comments/likes" value={commentsLikes} onValueChange={setCommentsLikes} />
      <Row label="Promotional emails" value={promoEmails} onValueChange={setPromoEmails} />

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Privacy</Text>
      <Text>Profile visibility: {profileVisibility === 'public' ? 'Public' : 'Private'}</Text>
      <Row label="Show location" value={showLocation} onValueChange={setShowLocation} />
      <Text>Who can message you: {whoCanMessage}</Text>
      <TouchableOpacity style={{ marginTop: 8 }}><Text style={{ color: '#007AFF' }}>Blocked users</Text></TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Support</Text>
      <TouchableOpacity><Text style={{ color: '#007AFF' }}>Help center</Text></TouchableOpacity>
      <TouchableOpacity><Text style={{ color: '#007AFF' }}>Contact support</Text></TouchableOpacity>
      <TouchableOpacity><Text style={{ color: '#007AFF' }}>Report a problem</Text></TouchableOpacity>
      <TouchableOpacity><Text style={{ color: '#007AFF' }}>Terms of service</Text></TouchableOpacity>
      <TouchableOpacity><Text style={{ color: '#007AFF' }}>Privacy policy</Text></TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>App</Text>
      <Text>Language: System</Text>
      <Text>Theme: Auto</Text>
      <Text>Data usage: Balanced</Text>
      <TouchableOpacity><Text style={{ color: '#007AFF' }}>Clear cache</Text></TouchableOpacity>
      <Text>Version: 1.0.0</Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#FF3B30' }}>Danger Zone</Text>
      <TouchableOpacity onPress={logout}><Text style={{ color: '#FF3B30' }}>Logout</Text></TouchableOpacity>
      <TouchableOpacity><Text style={{ color: '#FF3B30' }}>Delete account</Text></TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
