import React from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet } from 'react-native';
=======
import { View, Text, StyleSheet, FlatList } from 'react-native';
>>>>>>> origin/main

const MyBookingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>My Bookings Screen</Text>
=======
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
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

export default MyBookingsScreen;
=======
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
});

export default MyBookingsScreen;
>>>>>>> origin/main
