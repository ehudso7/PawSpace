import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
=======
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
>>>>>>> origin/main
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'Editor'>;

<<<<<<< HEAD
const EditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement image editor with filters and effects */}
=======
const EditorScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editor Screen</Text>
=======

const EditorScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Transformation</Text>
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

export default EditorScreen;
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

export default EditorScreen;
=======
    marginBottom: 20,
  },
});

export default EditorScreen;
>>>>>>> origin/main
>>>>>>> origin/main
