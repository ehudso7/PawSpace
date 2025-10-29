import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';
import { ImageSelectorScreen, EditorScreen } from './src';

const Stack = createNativeStackNavigator();

/**
 * Example App.tsx showing how to integrate the transformation creator
 * into your PawSpace application
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ImageSelector"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6B4EFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {/* Image Selection Screen */}
          <Stack.Screen
            name="ImageSelector"
            component={ImageSelectorScreen}
            options={{
              title: 'Create Transformation',
              headerShown: true,
            }}
          />

          {/* Editor Screen */}
          <Stack.Screen
            name="Editor"
            component={EditorScreen}
            options={{
              headerShown: false,
              gestureEnabled: false, // Prevent swipe back during editing
            }}
          />

          {/* You can add more screens for preview/export */}
          {/* 
          <Stack.Screen
            name="Preview"
            component={PreviewScreen}
            options={{ title: 'Preview Transformation' }}
          />
          */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

/**
 * Example: Using the editor store in your components
 */
export function ExampleStoreUsage() {
  const {
    setImages,
    setTransition,
    addText,
    addSticker,
    setMusic,
    setFrame,
    clearAll,
    exportTransformation,
  } = useTransformationStore();

  const handleCreateTransformation = async () => {
    try {
      // Set up your transformation
      setImages('path/to/before.jpg', 'path/to/after.jpg');

      setTransition('fade');
      
      addText({
        id: '1',
        text: 'Amazing!',
        position: { x: 100, y: 100 },
        style: {
          fontSize: 24,
          color: '#FF6B6B',
          fontWeight: 'bold',
        },
      });

      addSticker({
        id: '1',
        type: 'heart',
        position: { x: 200, y: 200 },
        scale: 1.2,
      });

      setMusic('upbeat-track.mp3');
      setFrame('vintage');

      // Export the final transformation
      const result = await exportTransformation();
      console.log('Transformation exported:', result);
    } catch (error) {
      console.error('Error creating transformation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transformation Creator</Text>
      <Button
        title="Create New Transformation"
        onPress={handleCreateTransformation}
      />
      <Button
        title="Clear All"
        onPress={clearAll}
      />
    </View>
  );
}

/**
 * Example: Custom transition effects
 */
export const customTransitions = {
  fade: {
    type: 'fade',
    duration: 1000,
  },
  slide: {
    type: 'slide',
    direction: 'left',
    duration: 800,
  },
  zoom: {
    type: 'zoom',
    scale: 1.2,
    duration: 1200,
  },
  rotate: {
    type: 'rotate',
    angle: 360,
    duration: 1500,
  },
};

/**
 * Example: Text overlay presets
 */
export const textPresets = {
  celebration: {
    text: '🎉 Amazing!',
    style: {
      fontSize: 32,
      color: '#FFD700',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
  },
  beforeAfter: {
    text: 'Before & After',
    style: {
      fontSize: 24,
      color: '#FFFFFF',
      fontWeight: '600',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: 8,
      borderRadius: 4,
    },
  },
  progress: {
    text: 'Progress Update',
    style: {
      fontSize: 20,
      color: '#4CAF50',
      fontWeight: '500',
    },
  },
};

/**
 * Example: Sticker categories
 */
export const stickerCategories = {
  emotions: ['😊', '😍', '🤩', '😎', '🥳'],
  animals: ['🐕', '🐱', '🐰', '🐹', '🐦'],
  objects: ['⭐', '💖', '🎀', '🏆', '💎'],
  symbols: ['❤️', '✨', '🌟', '💫', '🔥'],
};

/**
 * Example: Music tracks for different moods
 */
export const musicTracks = {
  upbeat: [
    { name: 'Happy Vibes', file: 'happy-vibes.mp3', duration: 30 },
    { name: 'Celebration', file: 'celebration.mp3', duration: 25 },
  ],
  calm: [
    { name: 'Peaceful', file: 'peaceful.mp3', duration: 45 },
    { name: 'Relaxing', file: 'relaxing.mp3', duration: 40 },
  ],
  dramatic: [
    { name: 'Epic Moment', file: 'epic.mp3', duration: 35 },
    { name: 'Transformation', file: 'transformation.mp3', duration: 30 },
  ],
};

/**
 * Example: Frame styles
 */
export const frameStyles = {
  vintage: {
    border: '8px solid #8B4513',
    borderRadius: '20px',
    filter: 'sepia(0.3)',
  },
  modern: {
    border: '2px solid #333',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  elegant: {
    border: '4px solid #FFD700',
    borderRadius: '12px',
    padding: '4px',
  },
  minimal: {
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    marginVertical: 10,
    minWidth: 200,
  },
};

// Mock hook for example
function useTransformationStore() {
  return {
    setImages: (_before: string, _after: string) => {},
    setTransition: (_type: string) => {},
    addText: (_text: any) => {},
    addSticker: (_sticker: any) => {},
    setMusic: (_music: string) => {},
    setFrame: (_frame: string) => {},
    clearAll: () => {},
    exportTransformation: async () => ({}),
  };
}