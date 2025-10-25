import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Edit Profile Screen</Text>
=======
      <Text style={styles.title}>Edit Profile</Text>
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

export default EditProfileScreen;
=======
    marginBottom: 20,
  },
});

export default EditProfileScreen;
>>>>>>> origin/main
