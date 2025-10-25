import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ServiceListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Services</Text>
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
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
  list: {
    flexGrow: 1,
  },
});

export default ServiceListScreen;