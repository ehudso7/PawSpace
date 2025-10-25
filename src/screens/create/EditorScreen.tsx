import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'Editor'>;

const EditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { imageUri } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement image editor with filters and effects */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default EditorScreen;