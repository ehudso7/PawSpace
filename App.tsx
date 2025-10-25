import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageSelectorScreen from './src/screens/create/ImageSelectorScreen';
import EditorScreen from './src/screens/create/EditorScreen';
import PreviewScreen from './src/screens/create/PreviewScreen';

export type RootStackParamList = {
  ImageSelector: undefined;
  Editor: undefined;
  Preview: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: '#0b0f14' },
      }}>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="ImageSelector" screenOptions={{ headerStyle: { backgroundColor: '#0b0f14' }, headerTintColor: '#fff' }}>
          <Stack.Screen name="ImageSelector" component={ImageSelectorScreen} options={{ title: 'Create Transformation' }} />
          <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Editor' }} />
          <Stack.Screen name="Preview" component={PreviewScreen} options={{ title: 'Preview' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
