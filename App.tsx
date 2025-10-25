import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import ImageSelectorScreen from './src/screens/create/ImageSelectorScreen';
import EditorScreen from './src/screens/create/EditorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="ImageSelector"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="ImageSelector"
              component={ImageSelectorScreen}
              options={{
                title: 'Select Images',
              }}
            />
            <Stack.Screen
              name="Editor"
              component={EditorScreen}
              options={{
                title: 'Edit Transformation',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}