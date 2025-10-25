import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserStats, ProviderInfo } from '@/types';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export function ProfileScreen() {
  const { user, loading, refresh } = useAuth();
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState<UserStats>({ transformations: 0, following: 0, followers: 0 });
  const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
  const [tab, setTab] = useState<'transformations' | 'saved' | 'pets'>('transformations');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: s } = await supabase.rpc('get_user_stats', { uid: user.id });
      if (s) setStats(s as UserStats);
      if (user.is_provider) {
        const { data: p } = await supabase.from('provider_info').select('*').eq('user_id', user.id).single();
        setProviderInfo((p || null) as ProviderInfo | null);
      }
    };
    load();
  }, [user]);

  const onEditAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!res.canceled && res.assets?.[0] && user) {
      const file = res.assets[0];
      const path = `avatars/${user.id}.jpg`;
      await supabase.storage.from('public').upload(path, { uri: file.uri, type: 'image/jpeg', name: 'avatar.jpg' } as any, { upsert: true });
      await supabase.from('users').update({ avatar_url: path }).eq('id', user.id);
      await refresh();
    }
  };

  if (loading) return <View />;
  if (!user) return <View><Text>Not signed in</Text></View>;

  return (
    <ScrollView>
      {/* Header with cover, avatar, name, location, edit button */}
      <View>
        {user.cover_url ? (
          <Image source={{ uri: supabase.storage.from('public').getPublicUrl(user.cover_url).data.publicUrl }} style={{ width: '100%', height: 160 }} />
        ) : (
          <View style={{ width: '100%', height: 160, backgroundColor: '#eee' }} />
        )}
        <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onEditAvatar}>
            <Image
              source={{ uri: user.avatar_url ? supabase.storage.from('public').getPublicUrl(user.avatar_url).data.publicUrl : 'https://placehold.co/100x100' }}
              style={{ width: 80, height: 80, borderRadius: 40, marginRight: 12 }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user.full_name || 'Unnamed'}</Text>
            {!!user.location && <Text style={{ color: '#666' }}>{user.location}</Text>}
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={{ color: '#007AFF' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' }}>
        <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>{stats.transformations}</Text><Text>Transformations</Text></View>
        <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>{stats.following}</Text><Text>Following</Text></View>
        <View style={{ alignItems: 'center' }}><Text style={{ fontWeight: 'bold' }}>{stats.followers}</Text><Text>Followers</Text></View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 }}>
        {(['transformations','saved','pets'] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={{ fontWeight: tab === t ? 'bold' : 'normal' }}>{t[0].toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab content */}
      {tab === 'transformations' && (
        <FlatList
          data={[]}
          numColumns={3}
          keyExtractor={(i, idx) => String(idx)}
          renderItem={() => <View style={{ width: '33.33%', aspectRatio: 1, backgroundColor: '#ddd' }} />}
        />
      )}
      {tab === 'saved' && (
        <View style={{ padding: 16 }}><Text>Saved posts go here</Text></View>
      )}
      {tab === 'pets' && (
        <View style={{ padding: 16 }}><Text>Pets list goes here</Text></View>
      )}

      {/* Provider sections */}
      {user.is_provider && (
        <View style={{ padding: 16, gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Services Offered</Text>
          <Text>{providerInfo?.services_offered?.join(', ') || '—'}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 12 }}>Total bookings</Text>
          <Text>{providerInfo?.total_bookings ?? 0}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 12 }}>Rating + reviews</Text>
          <Text>{providerInfo?.rating ?? '—'}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 12 }}>Revenue</Text>
          <Text>{providerInfo?.revenue ?? 0}</Text>
          <TouchableOpacity style={{ marginTop: 12 }}>
            <Text style={{ color: '#007AFF' }}>Switch to Business Tools</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
