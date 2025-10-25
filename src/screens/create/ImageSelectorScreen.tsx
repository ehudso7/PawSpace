import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'ImageSelector'>;

const ImageSelectorScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement image picker with camera and gallery options */}
=======
import { View, Text, StyleSheet } from 'react-native';

const ImageSelectorScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Image Selector Screen</Text>
=======
      <Text style={styles.title}>Select Images</Text>
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

export default ImageSelectorScreen;
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

export default ImageSelectorScreen;
=======
    marginBottom: 20,
  },
});

export default ImageSelectorScreen;
>>>>>>> origin/main
>>>>>>> origin/main
