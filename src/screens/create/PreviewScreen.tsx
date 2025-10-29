import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const PreviewScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview Screen</Text>
=======

const PreviewScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preview & Share</Text>
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PreviewScreen;
