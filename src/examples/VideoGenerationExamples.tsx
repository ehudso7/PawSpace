/**
 * Example Usage: Complete Video Generation and Publishing Flow
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useVideoExport } from '../hooks/useVideoExport';
import { useSocialSharing } from '../hooks/useSocialSharing';
import { getPawSpaceAPI } from '../services/pawspace-api';
import { estimateVideoSize, formatDuration } from '../utils/video.utils';

export const ExampleUsage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { generateVideo, saveToDevice, isGenerating, progress } = useVideoExport();
  const { shareToInstagram, shareToTikTok, shareGeneric } = useSocialSharing();

  // Example 1: Generate a simple before/after video
  const handleGenerateSimpleVideo = async () => {
    try {
      const url = await generateVideo({
        beforeImageUrl: 'https://example.com/dog-before.jpg',
        afterImageUrl: 'https://example.com/dog-after.jpg',
        transition: 'fade',
        duration: 6,
        textOverlays: [
          {
            text: 'Before',
            position: 'top',
            timestamp: 0,
            duration: 2.5,
          },
          {
            text: 'After',
            position: 'top',
            timestamp: 3.5,
            duration: 2.5,
          },
        ],
        fps: 30,
      });

      setVideoUrl(url);
      Alert.alert('Success', 'Video generated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate video');
    }
  };

  // Example 2: Generate video with custom styling
  const handleGenerateStyledVideo = async () => {
    try {
      const url = await generateVideo({
        beforeImageUrl: 'https://example.com/cat-before.jpg',
        afterImageUrl: 'https://example.com/cat-after.jpg',
        transition: 'slide',
        duration: 8,
        textOverlays: [
          {
            text: '🐱 Transformation Time!',
            position: 'top',
            fontFamily: 'Arial',
            fontSize: 48,
            color: 'white',
            timestamp: 0,
            duration: 3,
          },
          {
            text: 'Before Grooming',
            position: 'bottom',
            fontSize: 32,
            color: '#FFD700',
            timestamp: 0,
            duration: 3.5,
          },
          {
            text: 'After Grooming ✨',
            position: 'bottom',
            fontSize: 32,
            color: '#FFD700',
            timestamp: 4.5,
            duration: 3.5,
          },
        ],
        fps: 30,
      });

      setVideoUrl(url);
    } catch (error) {
      console.error(error);
    }
  };

  // Example 3: Generate and save to device
  const handleGenerateAndSave = async () => {
    try {
      const url = await generateVideo({
        beforeImageUrl: 'https://example.com/before.jpg',
        afterImageUrl: 'https://example.com/after.jpg',
        transition: 'fade',
        duration: 6,
        textOverlays: [],
        fps: 30,
      });

      // Save to device
      await saveToDevice(url);
      Alert.alert('Success', 'Video saved to your device!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save video');
    }
  };

  // Example 4: Generate and share to Instagram
  const handleGenerateAndShareInstagram = async () => {
    try {
      const url = await generateVideo({
        beforeImageUrl: 'https://example.com/before.jpg',
        afterImageUrl: 'https://example.com/after.jpg',
        transition: 'zoom',
        duration: 6,
        textOverlays: [
          {
            text: 'Glow Up! ✨',
            position: 'center',
            timestamp: 2,
            duration: 2,
          },
        ],
        fps: 30,
      });

      // Share to Instagram
      await shareToInstagram(url, {
        caption: 'Amazing transformation! 🐾 #petgrooming #beforeandafter',
        hashtags: ['#petgrooming', '#beforeandafter', '#dogsofinstagram'],
        isPrivate: false,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share to Instagram');
    }
  };

  // Example 5: Complete publishing flow
  const handleCompletePublishFlow = async () => {
    try {
      // Step 1: Generate video
      const url = await generateVideo({
        beforeImageUrl: 'https://example.com/before.jpg',
        afterImageUrl: 'https://example.com/after.jpg',
        transition: 'fade',
        duration: 6,
        textOverlays: [
          { text: 'Before', position: 'top', timestamp: 0, duration: 2.5 },
          { text: 'After', position: 'top', timestamp: 3.5, duration: 2.5 },
        ],
        fps: 30,
      });

      // Step 2: Publish to PawSpace
      const api = getPawSpaceAPI();
      const result = await api.publishVideo(url, {
        caption: 'Check out this amazing transformation!',
        hashtags: ['#petgrooming', '#beforeandafter'],
        isPrivate: false,
        provider: {
          name: 'Paw Perfect Grooming',
          link: 'https://example.com/provider',
        },
      });

      Alert.alert('Published!', `Post ID: ${result.postId}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish');
    }
  };

  // Example 6: Estimate video size before generating
  const handleEstimateSize = () => {
    const size = estimateVideoSize(6, 30, '1080p');
    Alert.alert('Estimated Size', `~${size} MB`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Video Generation Examples</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerateSimpleVideo}
        disabled={isGenerating}
      >
        <Text style={styles.buttonText}>
          {isGenerating ? `Generating... ${progress}%` : '1. Simple Video'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerateStyledVideo}
        disabled={isGenerating}
      >
        <Text style={styles.buttonText}>2. Styled Video with Emojis</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerateAndSave}
        disabled={isGenerating}
      >
        <Text style={styles.buttonText}>3. Generate & Save to Device</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerateAndShareInstagram}
        disabled={isGenerating}
      >
        <Text style={styles.buttonText}>4. Generate & Share to Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCompletePublishFlow}
        disabled={isGenerating}
      >
        <Text style={styles.buttonText}>5. Complete Publish Flow</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleEstimateSize}
      >
        <Text style={styles.buttonText}>6. Estimate Video Size</Text>
      </TouchableOpacity>

      {videoUrl && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Generated Video URL:</Text>
          <Text style={styles.resultUrl} numberOfLines={2}>
            {videoUrl}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  resultUrl: {
    fontSize: 12,
    color: '#666',
  },
});
