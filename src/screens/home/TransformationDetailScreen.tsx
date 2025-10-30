import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const TransformationDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Transformation Detail</Text>
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

export default TransformationDetailScreen;
