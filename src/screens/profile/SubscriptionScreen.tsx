import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubscriptionScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Subscription Screen</Text>
=======
      <Text style={styles.title}>Subscription</Text>
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

export default SubscriptionScreen;
=======
    marginBottom: 20,
  },
});

export default SubscriptionScreen;
>>>>>>> origin/main
