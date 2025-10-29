import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'TransformationDetail'>;

const TransformationDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transformationId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transformation Details</Text>
      {/* TODO: Implement transformation detail view */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default TransformationDetailScreen;
