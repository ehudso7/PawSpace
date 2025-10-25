import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ImageSelectorScreen, EditorScreen } from './src';

const Stack = createStackNavigator();

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
    beforeImage,
    afterImage,
    transition,
    textOverlays,
    stickers,
    music,
    frame,
    setImages,
    setTransition,
    addText,
    addSticker,
    setMusic,
    setFrame,
    undo,
    redo,
    reset,
  } = useEditorStore();

  // Example: Programmatically add text
  const handleAddWelcomeText = () => {
    addText({
      id: `text-${Date.now()}`,
      text: 'Welcome to PawSpace!',
      font: 'System',
      color: '#FFFFFF',
      size: 32,
      position: { x: 100, y: 100 },
      rotation: 0,
    });
  };

  // Example: Programmatically set transition
  const handleSetFadeTransition = () => {
    setTransition('fade');
  };

  // Example: Add a sticker
  const handleAddHeartSticker = () => {
    addSticker({
      id: `sticker-${Date.now()}`,
      uri: 'heart-icon',
      position: { x: 200, y: 200 },
      scale: 1,
      rotation: 0,
    });
  };

  return (
    <View>
      {/* Your UI here */}
    </View>
  );
}

/**
 * Example: Direct component usage
 */
export function ExampleComponentUsage() {
  return (
    <View style={{ flex: 1 }}>
      {/* Use ImageComparer directly */}
      <ImageComparer
        beforeImage="https://example.com/before.jpg"
        afterImage="https://example.com/after.jpg"
        mode="overlay"
      />

      {/* Use TransitionPreview directly */}
      <TransitionPreview
        beforeImage="https://example.com/before.jpg"
        afterImage="https://example.com/after.jpg"
        transition="slide"
        isPlaying={true}
        duration={2000}
      />
    </View>
  );
}

/**
 * Example: Custom navigation params
 */
export type RootStackParamList = {
  ImageSelector: undefined;
  Editor: {
    beforeImage?: string;
    afterImage?: string;
  };
  Preview: {
    editorState: any;
  };
};

// Use with typed navigation
import { NavigationProp } from '@react-navigation/native';

type EditorNavigationProp = NavigationProp<RootStackParamList, 'Editor'>;

export function ExampleWithNavigation({ navigation }: { navigation: EditorNavigationProp }) {
  const handleNavigateToEditor = () => {
    // You can optionally pass pre-selected images
    navigation.navigate('Editor', {
      beforeImage: 'uri://cached-before.jpg',
      afterImage: 'uri://cached-after.jpg',
    });
  };

  return (
    <TouchableOpacity onPress={handleNavigateToEditor}>
      <Text>Open Editor</Text>
    </TouchableOpacity>
  );
}

/**
 * Example: Export/Save functionality
 */
export function ExampleExportHandler() {
  const editorState = useEditorStore();

  const handleExportTransformation = async () => {
    try {
      // In a real app, you would:
      // 1. Render the transformation to a canvas or view
      // 2. Capture as image using react-native-view-shot
      // 3. Save to camera roll or upload to server
      
      const transformationData = {
        beforeImage: editorState.beforeImage,
        afterImage: editorState.afterImage,
        transition: editorState.transition,
        textOverlays: editorState.textOverlays,
        stickers: editorState.stickers,
        music: editorState.music,
        frame: editorState.frame,
        createdAt: new Date().toISOString(),
      };

      // Save to your backend
      // await api.saveTransformation(transformationData);

      console.log('Transformation exported:', transformationData);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleExportTransformation}>
      <Text>Export Transformation</Text>
    </TouchableOpacity>
  );
}
