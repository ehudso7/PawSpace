import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'Feed'>;

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement pet transformation feed */}

const FeedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default FeedScreen;
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
