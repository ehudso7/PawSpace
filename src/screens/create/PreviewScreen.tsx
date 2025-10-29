import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ route }) => {
  const { transformationData } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview</Text>
      <Text>{JSON.stringify(transformationData)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});

export default PreviewScreen;
