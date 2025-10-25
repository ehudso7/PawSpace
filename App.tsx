import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import ImageSelectorScreen from './src/screens/create/ImageSelectorScreen';
import EditorScreen from './src/screens/create/EditorScreen';
import PreviewScreen from './src/screens/create/PreviewScreen';

export type RootStackParamList = {
  ImageSelector: undefined;
  Editor: undefined;
  Preview: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0f1115',
    text: '#ffffff'
  }
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar barStyle="light-content" />
          <Stack.Navigator initialRouteName="ImageSelector" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ImageSelector" component={ImageSelectorScreen} />
            <Stack.Screen name="Editor" component={EditorScreen} />
            <Stack.Screen name="Preview" component={PreviewScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
