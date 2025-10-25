import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CreateButtonProps {
  onPress: () => void;
  isScrollingDown?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const CreateButton: React.FC<CreateButtonProps> = ({
  onPress,
  isScrollingDown = false,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  // Hide/show based on scroll direction
  React.useEffect(() => {
    translateY.value = withSpring(isScrollingDown ? 100 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isScrollingDown]);

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>+</Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  icon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
    lineHeight: 24,
  },
});