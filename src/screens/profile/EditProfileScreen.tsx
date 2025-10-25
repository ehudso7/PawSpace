import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { ProfileStackScreenProps } from '../../types/navigation';

type Props = ProfileStackScreenProps<'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Edit Profile</Text>
      <Text variant="bodyLarge">Edit your profile information here</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Save Changes
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 20,
  },
});

export default EditProfileScreen;