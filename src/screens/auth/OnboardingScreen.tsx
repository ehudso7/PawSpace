import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import Button from '@/components/common/Button';
import { theme } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = '@pawspace:onboarding_completed';

const onboardingSlides = [
  {
    id: 1,
    title: 'Find Pet Care Services',
    description: 'Discover trusted pet care providers near you for grooming, boarding, and more.',
    emoji: '??',
  },
  {
    id: 2,
    title: 'Book Appointments Easily',
    description: 'Schedule appointments with your favorite providers in just a few taps.',
    emoji: '??',
  },
  {
    id: 3,
    title: 'Track Transformations',
    description: 'Share and see amazing before & after pet transformations from our community.',
    emoji: '?',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('Login');
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingSlides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
    padding: 8,
  },
  skipText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;

// Helper function to check if onboarding was completed
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
};

// Helper function to reset onboarding (for testing)
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
};