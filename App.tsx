import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { TransformationForm } from './src/components/TransformationForm';
import { PreviewScreen } from './src/components/PreviewScreen';
import { TransitionType } from './src/types/transformation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'form' | 'preview'>('form');
  const [transformationData, setTransformationData] = useState<{
    beforeImageUri: string;
    afterImageUri: string;
    caption: string;
    transitionType: TransitionType;
    isPublic: boolean;
  } | null>(null);

  // Mock image URIs for demonstration
  const mockBeforeImage = 'https://picsum.photos/400/400?random=1';
  const mockAfterImage = 'https://picsum.photos/400/400?random=2';

  const handlePreview = (data: {
    beforeImageUri: string;
    afterImageUri: string;
    caption: string;
    transitionType: TransitionType;
    isPublic: boolean;
  }) => {
    setTransformationData(data);
    setCurrentScreen('preview');
  };

  const handleSaveDraft = (data: {
    beforeImageUri: string;
    afterImageUri: string;
    caption: string;
    transitionType: TransitionType;
    isPublic: boolean;
  }) => {
    // In a real app, this would save to local storage or API
    console.log('Draft saved:', data);
  };

  const handleBack = () => {
    setCurrentScreen('form');
  };

  const handleRetry = () => {
    // Reset and try again
    setCurrentScreen('form');
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {currentScreen === 'form' ? (
          <TransformationForm
            beforeImageUri={mockBeforeImage}
            afterImageUri={mockAfterImage}
            onPreview={handlePreview}
            onSaveDraft={handleSaveDraft}
          />
        ) : (
          <PreviewScreen
            beforeImageUri={transformationData?.beforeImageUri || mockBeforeImage}
            afterImageUri={transformationData?.afterImageUri || mockAfterImage}
            transitionType={transformationData?.transitionType || 'crossfade'}
            onBack={handleBack}
            onRetry={handleRetry}
          />
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});