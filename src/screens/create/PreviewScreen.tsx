import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const PreviewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Preview Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PreviewScreen;
