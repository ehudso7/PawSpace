import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';

// Import screens
import PreviewScreen from './src/screens/create/PreviewScreen';

// Import services and config
import { initializeCloudinary } from './src/services';
import { cloudinaryConfig, validateCloudinaryConfig } from './src/config/cloudinary';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Validate Cloudinary configuration
      if (!validateCloudinaryConfig()) {
        Alert.alert(
          'Configuration Error',
          'Please configure your Cloudinary credentials in the environment variables.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Initialize Cloudinary service
      initializeCloudinary(cloudinaryConfig);
      
      console.log('PawSpace app initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert(
        'Initialization Error',
        'Failed to initialize the app. Please restart and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Preview"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen 
            name="Preview" 
            component={PreviewScreen}
            initialParams={{
              videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog_transformation.mp4',
              videoPublicId: 'demo/dog_transformation',
              beforeImageUrl: 'https://res.cloudinary.com/demo/image/upload/dog_before.jpg',
              afterImageUrl: 'https://res.cloudinary.com/demo/image/upload/dog_after.jpg'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}