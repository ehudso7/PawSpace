import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import {
  Button,
  Text,
  Title,
  Paragraph,
} from 'react-native-paper';
import PagerView from 'react-native-pager-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingSlide } from '../../types';

interface OnboardingScreenProps {
  navigation: any;
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Find Trusted Pet Services',
    description: 'Connect with verified pet sitters, dog walkers, groomers, and veterinarians in your neighborhood.',
    image: '🐕‍🦺', // Using emoji as placeholder - replace with actual images
  },
  {
    id: '2',
    title: 'Book with Confidence',
    description: 'Read reviews, view profiles, and book services that fit your schedule and budget.',
    image: '📅',
  },
  {
    id: '3',
    title: 'Your Pet\'s Safety First',
    description: 'All service providers are background-checked and insured for your peace of mind.',
    image: '🛡️',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
  onComplete,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleNext = () => {
    if (currentPage < ONBOARDING_SLIDES.length - 1) {
      const nextPage = currentPage + 1;
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
    }
  };

  const handleSkip = async () => {
    await markOnboardingComplete();
    onComplete();
  };

  const handleGetStarted = async () => {
    await markOnboardingComplete();
    onComplete();
  };

  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  const handlePageSelected = (event: any) => {
    setCurrentPage(event.nativeEvent.position);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      <View style={styles.imageContainer}>
        <Text style={styles.slideImage}>{slide.image}</Text>
      </View>
      
      <View style={styles.textContainer}>
        <Title style={styles.slideTitle}>{slide.title}</Title>
        <Paragraph style={styles.slideDescription}>{slide.description}</Paragraph>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {ONBOARDING_SLIDES.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentPage && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  const isLastSlide = currentPage === ONBOARDING_SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Skip Button */}
      {!isLastSlide && (
        <View style={styles.skipContainer}>
          <Button mode="text" onPress={handleSkip} style={styles.skipButton}>
            Skip
          </Button>
        </View>
      )}

      {/* Slides */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {ONBOARDING_SLIDES.map((slide, index) => renderSlide(slide, index))}
      </PagerView>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {renderPagination()}
        
        <View style={styles.buttonContainer}>
          {isLastSlide ? (
            <Button
              mode="contained"
              onPress={handleGetStarted}
              style={styles.getStartedButton}
              contentStyle={styles.buttonContent}
            >
              Get Started
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.nextButton}
              contentStyle={styles.buttonContent}
            >
              Next
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

// Helper function to check if onboarding should be shown
export const shouldShowOnboarding = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem('onboarding_completed');
    return completed !== 'true';
  } catch (error) {
    console.error('Failed to check onboarding status:', error);
    return true; // Show onboarding if we can't determine the status
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipButton: {
    paddingHorizontal: 0,
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  slideImage: {
    fontSize: 120,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
    marginBottom: 20,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    paddingBottom: 50,
    paddingHorizontal: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#2196F3',
    width: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  nextButton: {
    borderRadius: 25,
    elevation: 2,
  },
  getStartedButton: {
    borderRadius: 25,
    elevation: 2,
    backgroundColor: '#4CAF50',
  },
  buttonContent: {
    paddingVertical: 12,
  },
});