import React from 'react';
import { Image, View, Text } from 'react-native';

interface Props {
  uri?: string;
  size?: number;
  name?: string;
}

export const Avatar: React.FC<Props> = ({ uri, size = 48, name }) => {
  if (uri) {
    return (
      <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
    );
  }
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold' }}>{initials}</Text>
    </View>
  );
};
