import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { PreviewScreen } from './src/screens/PreviewScreen';
import { ServiceContainer, defaultConfig } from './src/services';
import { ErrorHandler } from './src/utils/errorHandler';
import { NotificationUtils } from './src/utils/notifications';

export default function App() {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [servicesInitialized, setServicesInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize services
      ServiceContainer.initialize(defaultConfig);
      
      // Request permissions
      await requestPermissions();
      
      setServicesInitialized(true);
      
      // For demo purposes, set some sample images
      // In a real app, these would come from image picker
      setBeforeImage('https://example.com/before.jpg'); // Replace with actual image
      setAfterImage('https://example.com/after.jpg');   // Replace with actual image
      setShowPreview(true);
      
    } catch (error) {
      ErrorHandler.handleError(error, 'app initialization');
    }
  };

  const requestPermissions = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        NotificationUtils.showPermissionRequest('camera', () => {
          ImagePicker.requestCameraPermissionsAsync();
        });
      }

      // Request media library permissions
      const mediaPermission = await MediaLibrary.requestPermissionsAsync();
      if (!mediaPermission.granted) {
        NotificationUtils.showPermissionRequest('photos', () => {
          MediaLibrary.requestPermissionsAsync();
        });
      }

      // Request image picker permissions
      const imagePickerPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!imagePickerPermission.granted) {
        Alert.alert(
          'Permission Required',
          'This app needs access to your photo library to select images for transformations.'
        );
      }

    } catch (error) {
      console.warn('Error requesting permissions:', error);
    }
  };

  const handleBack = () => {
    setShowPreview(false);
    // In a real app, navigate back to image selection screen
  };

  const handleSave = (transformationData: any) => {
    console.log('Transformation saved:', transformationData);
    NotificationUtils.showSaveSuccess();
    // In a real app, navigate to feed or profile screen
  };

  if (!servicesInitialized) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          {/* Add loading spinner here */}
        </View>
      </SafeAreaProvider>
    );
  }

  if (!beforeImage || !afterImage) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          {/* Add image picker screen here */}
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {showPreview && (
          <PreviewScreen
            beforeImageUri={beforeImage}
            afterImageUri={afterImage}
            onBack={handleBack}
            onSave={handleSave}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});