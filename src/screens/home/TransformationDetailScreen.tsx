import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'TransformationDetail'>;

const TransformationDetailScreen: React.FC<Props> = ({ route }) => {
  const { transformationId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transformation Detail</Text>
      <Text>ID: {transformationId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default TransformationDetailScreen;
