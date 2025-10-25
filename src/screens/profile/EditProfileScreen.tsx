import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement profile editing form */}
=======
import { View, Text, StyleSheet } from 'react-native';

const EditProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Edit Profile Screen</Text>
=======
      <Text style={styles.title}>Edit Profile</Text>
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

export default EditProfileScreen;
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

export default EditProfileScreen;
=======
    marginBottom: 20,
  },
});

export default EditProfileScreen;
>>>>>>> origin/main
>>>>>>> origin/main
