import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ImageSelectorScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Image Selector Screen</Text>
=======
      <Text style={styles.title}>Select Images</Text>
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

export default ImageSelectorScreen;
=======
    marginBottom: 20,
  },
});

export default ImageSelectorScreen;
>>>>>>> origin/main
