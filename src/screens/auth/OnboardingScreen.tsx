/**
 * Onboarding Screen Component
 * Shows swipeable cards explaining app features
 * Only displayed on first app launch
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Button, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingScreenProps {
  navigation: any;
}

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = '@pawspace_onboarding_completed';

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Find Trusted Pet Services',
    description:
      'Connect with verified pet care professionals in your area. From dog walking to grooming, find the perfect match for your furry friend.',
    icon: 'paw',
    color: '#6200ee',
  },
  {
    id: '2',
    title: 'Book with Confidence',
    description:
      'Read reviews, check ratings, and book services seamlessly. Track appointments and communicate directly with service providers.',
    icon: 'calendar-check',
    color: '#03dac6',
  },
  {
    id: '3',
    title: 'Your Pet\'s Well-being Matters',
    description:
      'Access pet care tips, health tracking, and a community of pet lovers. Keep your pets happy, healthy, and well-cared for.',
    icon: 'heart',
    color: '#ff6b6b',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  /**
   * Mark onboarding as completed and navigate to signup
   */
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      navigation.replace('Signup');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.replace('Signup');
    }
  };

  /**
   * Handle skip button press
   */
  const handleSkip = () => {
    completeOnboarding();
  };

  /**
   * Handle next/get started button press
   */
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  };

  /**
   * Handle scroll end
   */
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  /**
   * Render individual slide
   */
  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <IconButton icon={item.icon} size={80} iconColor={item.color} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Description */}
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  /**
   * Render pagination dots
   */
  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
        scrollEventThrottle={16}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination */}
        {renderPagination()}

        {/* Next/Get Started Button */}
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {isLastSlide ? 'Get Started' : 'Next'}
        </Button>

        {/* Back Button */}
        {currentIndex > 0 && (
          <Button
            mode="text"
            onPress={() => {
              const prevIndex = currentIndex - 1;
              flatListRef.current?.scrollToIndex({
                index: prevIndex,
                animated: true,
              });
              setCurrentIndex(prevIndex);
            }}
            style={styles.backButton}
          >
            Back
          </Button>
        )}
      </View>
    </View>
  );
};

/**
 * Check if onboarding has been completed
 * Call this function before navigating to determine if onboarding should be shown
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Reset onboarding status (useful for testing)
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Error resetting onboarding status:', error);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    paddingTop: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#6200ee',
  },
  button: {
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    alignSelf: 'center',
  },
});
