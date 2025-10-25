import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { CreateStackScreenProps } from '../../types/navigation';

type Props = CreateStackScreenProps<'PostEditor'>;

const PostEditorScreen: React.FC<Props> = ({ route, navigation }) => {
  const { selectedImages } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Create Post</Text>
      <Text variant="bodyLarge">Selected Images: {selectedImages.length}</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Publish Post
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 20,
  },
});

export default PostEditorScreen;