import React, { useMemo, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { Text, Button, Chip, Divider, useTheme, Card, Avatar as PaperAvatar } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { usePets } from '@/context/PetsContext';

const Tab = createMaterialTopTabNavigator();

const numColumns = 3;
const size = Math.floor(Dimensions.get('window').width / numColumns);

function TransformationsTab() {
  // Demo grid
  const data = useMemo(() => Array.from({ length: 12 }).map((_, i) => ({ id: String(i), uri: `https://picsum.photos/seed/t${i}/300/300` })), []);
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={{ width: size, height: size }} />
      )}
    />
  );
}

function SavedTab() {
  const data = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({ id: String(i), uri: `https://picsum.photos/seed/s${i}/300/300` })), []);
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <Image source={{ uri: item.uri }} style={{ width: size, height: size }} />
      )}
    />
  );
}

function PetsTab() {
  const { pets } = usePets();
  const navigation = useNavigation<any>();
  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {pets.map((p) => (
          <Card key={p.id} style={{ marginBottom: 12 }} onPress={() => navigation.navigate('PetModal', { petId: p.id })}>
            <Card.Title title={p.name} subtitle={`${p.species}${p.breed ? ' • ' + p.breed : ''}`} left={(props) => (
              p.photoUri ? <PaperAvatar.Image {...props} source={{ uri: p.photoUri }} /> : <PaperAvatar.Icon {...props} icon="paw" />
            )} />
            {p.notes ? <Card.Content><Text>{p.notes}</Text></Card.Content> : null}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

export default function ProfileScreen() {
  const { currentUser, updateProfile } = useAuth();
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const [updating, setUpdating] = useState(false);

  if (!currentUser) return null;

  const isProvider = currentUser.userType === 'provider';

  const onChangeAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) {
      setUpdating(true);
      await updateProfile({ avatarUrl: res.assets[0].uri });
      setUpdating(false);
    }
  };

  const Header = (
    <View>
      <TouchableOpacity activeOpacity={0.9}>
        <Image source={{ uri: currentUser.coverUrl || 'https://picsum.photos/seed/cover/1200/600' }} style={styles.cover} />
      </TouchableOpacity>
      <View style={{ marginTop: -40, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={onChangeAvatar} activeOpacity={0.7}>
          {currentUser.avatarUrl ? (
            <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }]}>
              <Text variant="titleLarge">+</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text variant="titleLarge">{currentUser.fullName || 'Unnamed'}</Text>
          {currentUser.location?.name ? (
            <Text style={{ color: theme.colors.onSurfaceVariant }}>{currentUser.location.name}</Text>
          ) : null}
        </View>
        <Button mode="contained" onPress={() => navigation.navigate('EditProfile')} loading={updating}>
          Edit Profile
        </Button>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}><Text variant="titleMedium">{currentUser.stats?.transformations ?? 0}</Text><Text>Transformations</Text></View>
        <Divider style={styles.statDivider} vertical bold />
        <View style={styles.statItem}><Text variant="titleMedium">{currentUser.stats?.following ?? 0}</Text><Text>Following</Text></View>
        <Divider style={styles.statDivider} vertical bold />
        <View style={styles.statItem}><Text variant="titleMedium">{currentUser.stats?.followers ?? 0}</Text><Text>Followers</Text></View>
      </View>

      {isProvider && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text variant="titleMedium" style={{ marginTop: 8 }}>Services Offered</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {(currentUser.providerDetails?.servicesOffered || ['Grooming', 'Training']).map((s, idx) => (
              <Chip key={`${s}-${idx}`}>{s}</Chip>
            ))}
          </View>

          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text>Total bookings</Text>
              <Text variant="headlineSmall">{currentUser.providerDetails?.totalBookings ?? 0}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Rating</Text>
              <Text variant="headlineSmall">{currentUser.providerDetails?.rating ?? 0} ⭐ ({currentUser.providerDetails?.reviewsCount ?? 0})</Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text>Revenue (YTD)</Text>
            <Text variant="headlineSmall">${currentUser.providerDetails?.revenueYtd?.toLocaleString() ?? '0'}</Text>
          </View>

          <Button style={{ marginTop: 12 }} mode="outlined" onPress={() => {}}>
            Switch to Business Tools
          </Button>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {Header}
        <View style={{ height: 400 }}>
          <Tab.Navigator>
            <Tab.Screen name="Transformations" component={TransformationsTab} />
            <Tab.Screen name="Saved" component={SavedTab} />
            <Tab.Screen name="Pets" component={PetsTab} />
          </Tab.Navigator>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', height: 160 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#fff' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12 },
  statItem: { alignItems: 'center' },
  statDivider: { height: 40 }
});
