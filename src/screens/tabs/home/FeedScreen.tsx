import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../types/navigation';

export type FeedScreenProps = NativeStackScreenProps<HomeStackParamList, 'Feed'>;

const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Feed</Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('PostDetails', { postId: 'demo-post' })}
      >
        Open Post Details
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default FeedScreen;
