import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

interface Props {
  uri?: string;
  size?: number;
  name?: string;
}

export const Avatar: React.FC<Props> = ({ uri, size = 40, name }) => {
  const initials = name ? name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() : '';
  return uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  ) : (
    <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}> 
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E7EB' },
  initials: { fontWeight: '600', color: '#374151' },
});
