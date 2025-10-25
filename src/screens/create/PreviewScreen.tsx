import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview Screen</Text>
=======

const PreviewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview & Share</Text>
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

export default PreviewScreen;
=======
    marginBottom: 20,
  },
});

export default PreviewScreen;
>>>>>>> origin/main
