import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transformationData } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement transformation preview with sharing options */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default PreviewScreen;