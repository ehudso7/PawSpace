import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement profile editing form */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default EditProfileScreen;
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
