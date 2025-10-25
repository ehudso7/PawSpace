import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { CreateStackScreenProps } from '../../types/navigation';

type Props = CreateStackScreenProps<'ImageSelectorScreen'>;

const ImageSelectorScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Create Content</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Choose what you'd like to create
      </Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('PostEditor', { 
          selectedImages: ['image1.jpg', 'image2.jpg'] 
        })}
        style={styles.button}
      >
        Create Post
      </Button>
      <Button 
        mode="outlined" 
        onPress={() => navigation.navigate('ServiceEditor', { 
          isEdit: false 
        })}
        style={styles.button}
      >
        Create Service
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  subtitle: {
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
  },
});

export default ImageSelectorScreen;