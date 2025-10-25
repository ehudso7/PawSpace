import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<HomeStackParamList, 'Feed'>;

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement pet transformation feed */}
=======
<<<<<<< HEAD
import { View, Text, StyleSheet } from 'react-native';
=======
import { View, Text, StyleSheet, FlatList } from 'react-native';
>>>>>>> origin/main

const FeedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Feed Screen</Text>
=======
      <Text style={styles.title}>Pet Transformations Feed</Text>
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
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

export default FeedScreen;
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

export default FeedScreen;
=======
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
});

export default FeedScreen;
>>>>>>> origin/main
>>>>>>> origin/main
