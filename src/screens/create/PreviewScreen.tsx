import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<CreateStackParamList, 'Preview'>;

const PreviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transformationData } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview & Share</Text>
      {/* TODO: Implement transformation preview with sharing options */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PreviewScreen;
