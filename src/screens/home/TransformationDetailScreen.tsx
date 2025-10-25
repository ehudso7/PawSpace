import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'TransformationDetail'>;

const TransformationDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transformationId } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement transformation detail view */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default TransformationDetailScreen;