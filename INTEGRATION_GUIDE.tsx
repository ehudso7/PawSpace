/**
 * Complete Integration Guide
 * Step-by-step implementation of the video transformation system
 */

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                    VIDEO TRANSFORMATION SYSTEM - QUICK START                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

IMPLEMENTATION CHECKLIST:

1. ✅ Install Dependencies
   npm install expo-av expo-image expo-image-manipulator expo-sharing 
   npm install expo-media-library expo-file-system expo-linear-gradient

2. ✅ Configure Environment
   - Copy .env.example to .env
   - Add Cloudinary credentials
   - Set API URL

3. ✅ Setup Permissions (app.json)
   - Add camera permissions
   - Add media library permissions
   - Add storage permissions

4. ✅ Initialize Services
   - Import and configure services
   - Set auth token
   - Test connectivity

5. ✅ Integrate UI Components
   - Add PreviewScreen to navigation
   - Connect to image picker
   - Handle callbacks

═══════════════════════════════════════════════════════════════════════════════
*/

// ============================================================================
// STEP 1: APP CONFIGURATION (app.json or app.config.js)
// ============================================================================

export const appConfig = {
  expo: {
    name: "PawSpace",
    plugins: [
      [
        "expo-media-library",
        {
          photosPermission: "Allow PawSpace to access your photos to save transformations.",
          savePhotosPermission: "Allow PawSpace to save transformation videos to your gallery."
        }
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow PawSpace to take photos for transformations."
        }
      ]
    ],
    ios: {
      infoPlist: {
        NSPhotoLibraryUsageDescription: "Allow PawSpace to access your photos.",
        NSPhotoLibraryAddUsageDescription: "Allow PawSpace to save videos to your gallery.",
        NSCameraUsageDescription: "Allow PawSpace to take photos.",
      }
    },
    android: {
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO"
      ]
    }
  }
};

// ============================================================================
// STEP 2: SERVICE INITIALIZATION
// ============================================================================

import { transformationsService } from './src/services/transformations';
import { videoGenerationService } from './src/services/videoGeneration';
import { sharingService } from './src/services/sharing';
import { cloudinaryService } from './src/services/cloudinary';
import { errorHandler } from './src/utils/errorHandler';

// Initialize services on app startup
export function initializeServices(authToken: string) {
  // Set authentication
  transformationsService.setAuthToken(authToken);
  
  // Validate configuration
  const isConfigured = validateConfiguration();
  if (!isConfigured) {
    console.warn('⚠️ Services not fully configured');
  }
  
  console.log('✅ Services initialized');
}

function validateConfiguration() {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (!cloudName) {
    console.error('❌ CLOUDINARY_CLOUD_NAME not configured');
    return false;
  }
  
  if (!apiUrl) {
    console.error('❌ API_URL not configured');
    return false;
  }
  
  return true;
}

// ============================================================================
// STEP 3: NAVIGATION INTEGRATION
// ============================================================================

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PreviewScreen } from './src/screens/PreviewScreen';

const Stack = createNativeStackNavigator();

export function TransformationNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ImagePicker" 
        component={ImagePickerScreen}
        options={{ title: 'Create Transformation' }}
      />
      <Stack.Screen 
        name="Preview" 
        component={PreviewScreen}
        options={{ 
          title: 'Preview',
          headerShown: false,
          presentation: 'fullScreenModal'
        }}
      />
      <Stack.Screen 
        name="Feed" 
        component={FeedScreen}
        options={{ title: 'Transformations' }}
      />
    </Stack.Navigator>
  );
}

// ============================================================================
// STEP 4: IMAGE PICKER INTEGRATION
// ============================================================================

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, View, Image } from 'react-native';

export function ImagePickerScreen({ navigation }: any) {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const pickImage = async (type: 'before' | 'after') => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      errorHandler.showError({
        code: 'PERMISSION_DENIED',
        message: 'Camera roll permission required'
      });
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'before') {
        setBeforeImage(result.assets[0].uri);
      } else {
        setAfterImage(result.assets[0].uri);
      }
    }
  };

  const handlePreview = () => {
    if (!beforeImage || !afterImage) {
      errorHandler.showError({
        code: 'INVALID_INPUT',
        message: 'Please select both before and after images'
      });
      return;
    }

    navigation.navigate('Preview', {
      beforeImageUri: beforeImage,
      afterImageUri: afterImage,
      caption: 'My amazing transformation!',
      transitionType: 'fade',
      isPublic: true,
      hasMusic: false,
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Before Image */}
      <View style={{ marginBottom: 20 }}>
        <Button title="Select Before Image" onPress={() => pickImage('before')} />
        {beforeImage && (
          <Image source={{ uri: beforeImage }} style={{ width: 200, height: 200 }} />
        )}
      </View>

      {/* After Image */}
      <View style={{ marginBottom: 20 }}>
        <Button title="Select After Image" onPress={() => pickImage('after')} />
        {afterImage && (
          <Image source={{ uri: afterImage }} style={{ width: 200, height: 200 }} />
        )}
      </View>

      {/* Preview Button */}
      <Button 
        title="Preview Transformation" 
        onPress={handlePreview}
        disabled={!beforeImage || !afterImage}
      />
    </View>
  );
}

// ============================================================================
// STEP 5: FEED INTEGRATION
// ============================================================================

import { FlatList, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';
import type { Transformation } from './src/types/transformation';

export function FeedScreen() {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const result = await transformationsService.getFeedTransformations(1, 20);
      setTransformations(result.transformations);
    } catch (error) {
      errorHandler.showError(error, 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await transformationsService.likeTransformation(id);
      // Update UI
      loadFeed();
    } catch (error) {
      errorHandler.showError(error);
    }
  };

  const handleShare = async (transformation: Transformation) => {
    if (!transformation.video_url && !transformation.gif_url) return;

    try {
      await sharingService.shareToDevice({
        videoUri: transformation.video_url,
        gifUri: transformation.gif_url,
        caption: transformation.caption,
        transformationId: transformation.id,
      });
    } catch (error) {
      errorHandler.showError(error, 'Share failed');
    }
  };

  return (
    <FlatList
      data={transformations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 20 }}>
          {/* Video */}
          {item.video_url && (
            <Video
              source={{ uri: item.video_url }}
              style={{ width: '100%', height: 300 }}
              useNativeControls
              resizeMode="contain"
            />
          )}

          {/* Caption */}
          <Text>{item.caption}</Text>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => handleLike(item.id)}>
              <Text>❤️ {item.likes_count}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare(item)}>
              <Text>↗️ Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      refreshing={loading}
      onRefresh={loadFeed}
    />
  );
}

// ============================================================================
// STEP 6: BACKGROUND PROCESSING (Optional)
// ============================================================================

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-video-generation';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Process any pending drafts in background
    const drafts = await transformationsService.getDrafts();
    
    for (const draft of drafts) {
      // Generate videos for drafts in background
      // This is an advanced feature for production
    }
    
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundTask() {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60, // 1 hour
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

// ============================================================================
// STEP 7: TESTING UTILITIES
// ============================================================================

export const TestUtils = {
  // Test video generation with sample images
  async testVideoGeneration() {
    console.log('🧪 Testing video generation...');
    
    try {
      const result = await videoGenerationService.generateTransformation(
        'https://picsum.photos/400/400',
        'https://picsum.photos/400/400',
        {
          transitionType: 'fade',
          duration: 2,
          mode: 'gif',
        },
        (progress) => {
          console.log(`Progress: ${progress.progress}% - ${progress.message}`);
        }
      );
      
      console.log('✅ Generation successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Generation failed:', error);
      throw error;
    }
  },

  // Test API connectivity
  async testAPI() {
    console.log('🧪 Testing API connectivity...');
    
    try {
      const feed = await transformationsService.getFeedTransformations(1, 5);
      console.log('✅ API connected. Found', feed.transformations.length, 'transformations');
      return feed;
    } catch (error) {
      console.error('❌ API error:', error);
      throw error;
    }
  },

  // Test sharing capabilities
  async testSharing() {
    console.log('🧪 Testing sharing...');
    
    try {
      const platforms = await sharingService.getAvailablePlatforms();
      console.log('✅ Available platforms:', platforms);
      return platforms;
    } catch (error) {
      console.error('❌ Sharing test failed:', error);
      throw error;
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🧪 Running all tests...\n');
    
    const results = {
      videoGeneration: false,
      api: false,
      sharing: false,
    };

    try {
      await this.testVideoGeneration();
      results.videoGeneration = true;
    } catch (e) {
      console.error('Video generation test failed');
    }

    try {
      await this.testAPI();
      results.api = true;
    } catch (e) {
      console.error('API test failed');
    }

    try {
      await this.testSharing();
      results.sharing = true;
    } catch (e) {
      console.error('Sharing test failed');
    }

    console.log('\n📊 Test Results:', results);
    return results;
  }
};

// ============================================================================
// STEP 8: MAIN APP ENTRY POINT
// ============================================================================

import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Initialize on app start
    async function setup() {
      // Set auth token (from your auth system)
      const authToken = 'your-auth-token-here';
      initializeServices(authToken);
      
      // Optional: Run tests in development
      if (__DEV__) {
        // TestUtils.runAllTests();
      }
    }
    
    setup();
  }, []);

  return (
    <NavigationContainer>
      <TransformationNavigator />
    </NavigationContainer>
  );
}

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                           DEPLOYMENT CHECKLIST                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

BEFORE PRODUCTION:

□ Set up Cloudinary account and get credentials
□ Configure environment variables (.env)
□ Set up backend API endpoints
□ Test video generation with real images
□ Test sharing on iOS and Android devices
□ Request and test all permissions
□ Add error tracking (Sentry, etc.)
□ Add analytics tracking
□ Test on slow network conditions
□ Test with large file sizes
□ Implement rate limiting
□ Add loading state persistence
□ Test background processing
□ Optimize video quality vs. file size
□ Add caching for generated videos
□ Test memory usage with multiple generations
□ Add user feedback mechanisms
□ Write unit tests
□ Write integration tests
□ Update app store descriptions
□ Add app store screenshots

═══════════════════════════════════════════════════════════════════════════════

SUPPORT:
- Documentation: README.md
- Examples: src/examples/usage.tsx
- Types: src/types/transformation.ts

Built with ❤️ for PawSpace
*/
