import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
=======
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
>>>>>>> origin/main
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'Preview'>;

<<<<<<< HEAD
const PreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transformationData } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement transformation preview with sharing options */}
=======
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
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#fff',
  },
});

export default PreviewScreen;
=======
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
>>>>>>> origin/main
