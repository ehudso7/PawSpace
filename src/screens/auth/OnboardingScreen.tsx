import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Title,
  Paragraph,
} from 'react-native-paper';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingSlide } from '../../types';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to PawSpace',
    description: 'The ultimate platform connecting pet owners with trusted service providers in your area.',
    image: '🐾',
  },
  {
    id: '2',
    title: 'Find Pet Services',
    description: 'Discover veterinarians, groomers, trainers, and other pet care professionals near you.',
    image: '🏥',
  },
  {
    id: '3',
    title: 'Book & Manage',
    description: 'Easily book appointments, track your pet\'s health records, and manage all services in one place.',
    image: '📱',
  },
];

const ONBOARDING_STORAGE_KEY = 'pawspace_onboarding_completed';

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleNext = () => {
    if (currentPage < ONBOARDING_SLIDES.length - 1) {
      const nextPage = currentPage + 1;
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      onComplete(); // Continue anyway
    }
  };

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={styles.imageContainer}>
          <Text style={styles.slideImage}>{slide.image}</Text>
        </View>
        
        <Title style={styles.slideTitle}>{slide.title}</Title>
        
        <Paragraph style={styles.slideDescription}>
          {slide.description}
        </Paragraph>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {ONBOARDING_SLIDES.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentPage && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {ONBOARDING_SLIDES.map((slide, index) => renderSlide(slide, index))}
      </PagerView>

      <View style={styles.footer}>
        {renderDots()}
        
        <View style={styles.buttonContainer}>
          <Button
            mode="text"
            onPress={handleSkip}
            style={styles.skipButton}
            labelStyle={styles.skipButtonText}
          >
            Skip
          </Button>
          
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.nextButtonText}
          >
            {currentPage === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </View>
      </View>
    </View>
  );
};

// Helper function to check if onboarding has been completed
export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding completion:', error);
    return false;
  }
};

// Helper function to reset onboarding (useful for testing)
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  pagerView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: screenWidth * 0.8,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slideImage: {
    fontSize: 80,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E7D32',
  },
  slideDescription: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    color: '#666',
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    paddingTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2E7D32',
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});