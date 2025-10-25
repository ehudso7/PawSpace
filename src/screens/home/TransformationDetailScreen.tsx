import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'TransformationDetail'>;

const TransformationDetailScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transformation Detail Screen</Text>
=======

const TransformationDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transformation Details</Text>
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
=======
    padding: 20,
>>>>>>> origin/main
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
<<<<<<< HEAD
  },
});

export default TransformationDetailScreen;
=======
    marginBottom: 20,
  },
});

export default TransformationDetailScreen;
>>>>>>> origin/main
