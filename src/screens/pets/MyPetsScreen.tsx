import React, { useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface PetItem { id: string; name: string; breed: string; age: number; photo: string }

export default function MyPetsScreen() {
  const nav = useNavigation<any>();
  const [pets, setPets] = useState<PetItem[]>([
    { id: '1', name: 'Buddy', breed: 'Golden Retriever', age: 3, photo: 'https://picsum.photos/seed/dog/200/200' },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pets}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <Pressable style={styles.primaryBtn} onPress={() => nav.navigate('AddEditPet')}>
            <Text style={styles.primaryBtnText}>Add pet</Text>
          </Pressable>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.photo }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={{ color: '#666' }}>{item.breed} • {item.age}y</Text>
            </View>
            <Pressable style={styles.btn} onPress={() => nav.navigate('AddEditPet', { petId: item.id })}>
              <Text style={styles.btnText}>Edit</Text>
            </Pressable>
            <View style={{ width: 8 }} />
            <Pressable style={styles.btn} onPress={() => setPets((ps) => ps.filter((p) => p.id !== item.id))}>
              <Text style={styles.btnText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  primaryBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  name: { fontWeight: '700' },
  btn: { backgroundColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnText: { fontWeight: '700' },
});
