import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSelectorScreen from './src/screens/create/ImageSelectorScreen';
import EditorScreen from './src/screens/create/EditorScreen';
import { useEditorStore } from './src/store/editorStore';

export default function App() {
  const { beforeImage, afterImage } = useEditorStore();

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          {beforeImage && afterImage ? (
            <EditorScreen />
          ) : (
            <ImageSelectorScreen />
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});