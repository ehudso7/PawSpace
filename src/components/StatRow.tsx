import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  transformations: number;
  following: number;
  followers: number;
}

export default function StatRow({ transformations, following, followers }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.item}><Text style={styles.value}>{transformations}</Text><Text>Transformations</Text></View>
      <View style={styles.item}><Text style={styles.value}>{following}</Text><Text>Following</Text></View>
      <View style={styles.item}><Text style={styles.value}>{followers}</Text><Text>Followers</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },
  item: { alignItems: 'center' },
  value: { fontWeight: '700' },
});
