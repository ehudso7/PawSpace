import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { TransitionType } from '../../types/transformation';
import { useEditorStore } from '../../store/editorStore';
import { TRANSITION_TYPES } from '../../constants/editor';
import ImageComparer from './ImageComparer';

const { width: screenWidth } = Dimensions.get('window');

interface TransitionPreviewProps {
  beforeImage: string;
  afterImage: string;
  transition: TransitionType;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

const TransitionPreview: React.FC<TransitionPreviewProps> = ({
  beforeImage,
  afterImage,
  transition,
  isPlaying,
  onPlayToggle,
}) => {
  const progress = useSharedValue(0);
  const [currentTransition, setCurrentTransition] = useState(transition);

  useEffect(() => {
    setCurrentTransition(transition);
  }, [transition]);

  useEffect(() => {
    if (isPlaying) {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      progress.value = withTiming(0, { duration: 500 });
    }
  }, [isPlaying]);

  const fadeStyle = useAnimatedStyle(() => {
    if (currentTransition !== 'fade') return {};
    
    return {
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    };
  });

  const slideStyle = useAnimatedStyle(() => {
    if (currentTransition !== 'slide') return {};
    
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, -screenWidth]
          ),
        },
      ],
    };
  });

  const swipeStyle = useAnimatedStyle(() => {
    if (currentTransition !== 'swipe') return {};
    
    const clipWidth = interpolate(progress.value, [0, 1], [screenWidth, 0]);
    return {
      width: clipWidth,
    };
  });

  const splitLeftStyle = useAnimatedStyle(() => {
    if (currentTransition !== 'split') return {};
    
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, -screenWidth / 4]
          ),
        },
      ],
    };
  });

  const splitRightStyle = useAnimatedStyle(() => {
    if (currentTransition !== 'split') return {};
    
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, screenWidth / 4]
          ),
        },
      ],
    };
  });

  const renderTransition = () => {
    switch (currentTransition) {
      case 'fade':
        return (
          <View style={styles.transitionContainer}>
            <Animated.Image
              source={{ uri: afterImage }}
              style={[styles.transitionImage, styles.baseImage]}
              resizeMode="cover"
            />
            <Animated.Image
              source={{ uri: beforeImage }}
              style={[styles.transitionImage, styles.overlayImage, fadeStyle]}
              resizeMode="cover"
            />
          </View>
        );

      case 'slide':
        return (
          <View style={styles.transitionContainer}>
            <Animated.Image
              source={{ uri: afterImage }}
              style={[styles.transitionImage, styles.baseImage]}
              resizeMode="cover"
            />
            <Animated.View style={[styles.slideContainer, slideStyle]}>
              <Animated.Image
                source={{ uri: beforeImage }}
                style={[styles.transitionImage]}
                resizeMode="cover"
              />
            </Animated.View>
          </View>
        );

      case 'swipe':
        return (
          <View style={styles.transitionContainer}>
            <Animated.Image
              source={{ uri: afterImage }}
              style={[styles.transitionImage, styles.baseImage]}
              resizeMode="cover"
            />
            <Animated.View style={[styles.swipeContainer, swipeStyle]}>
              <Animated.Image
                source={{ uri: beforeImage }}
                style={[styles.transitionImage]}
                resizeMode="cover"
              />
            </Animated.View>
          </View>
        );

      case 'split':
        return (
          <View style={styles.transitionContainer}>
            <View style={styles.splitContainer}>
              <Animated.View style={[styles.splitHalf, splitLeftStyle]}>
                <Animated.Image
                  source={{ uri: beforeImage }}
                  style={[styles.transitionImage]}
                  resizeMode="cover"
                />
              </Animated.View>
              <Animated.View style={[styles.splitHalf, splitRightStyle]}>
                <Animated.Image
                  source={{ uri: afterImage }}
                  style={[styles.transitionImage]}
                  resizeMode="cover"
                />
              </Animated.View>
            </View>
          </View>
        );

      default:
        return (
          <ImageComparer
            beforeImage={beforeImage}
            afterImage={afterImage}
            mode="side-by-side"
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderTransition()}
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={onPlayToggle}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={isPlaying ? '#FFFFFF' : '#4A90E2'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Transition Selector Component
interface TransitionSelectorProps {
  selectedTransition: TransitionType;
  onTransitionSelect: (transition: TransitionType) => void;
}

export const TransitionSelector: React.FC<TransitionSelectorProps> = ({
  selectedTransition,
  onTransitionSelect,
}) => {
  return (
    <View style={styles.selectorContainer}>
      <View style={styles.selectorHeader}>
        <Text style={styles.selectorTitle}>Transition Effect</Text>
      </View>
      
      <View style={styles.transitionGrid}>
        {TRANSITION_TYPES.map((transitionType) => (
          <TouchableOpacity
            key={transitionType.type}
            style={[
              styles.transitionOption,
              selectedTransition === transitionType.type && styles.transitionOptionSelected,
            ]}
            onPress={() => onTransitionSelect(transitionType.type)}
          >
            <View style={styles.transitionIcon}>
              {transitionType.type === 'fade' && (
                <Ionicons name="layers-outline" size={24} color="#666666" />
              )}
              {transitionType.type === 'slide' && (
                <Ionicons name="swap-horizontal-outline" size={24} color="#666666" />
              )}
              {transitionType.type === 'swipe' && (
                <Ionicons name="hand-left-outline" size={24} color="#666666" />
              )}
              {transitionType.type === 'split' && (
                <Ionicons name="resize-outline" size={24} color="#666666" />
              )}
            </View>
            <Text style={styles.transitionName}>{transitionType.name}</Text>
            <Text style={styles.transitionDescription}>
              {transitionType.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Full Transition Panel Component
interface TransitionPanelProps {
  beforeImage: string;
  afterImage: string;
}

export const TransitionPanel: React.FC<TransitionPanelProps> = ({
  beforeImage,
  afterImage,
}) => {
  const { transition, setTransition } = useEditorStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTransitionSelect = (newTransition: TransitionType) => {
    setTransition(newTransition);
    setIsPlaying(false);
  };

  if (!beforeImage || !afterImage) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="images-outline" size={48} color="#CCCCCC" />
        <Text style={styles.emptyStateText}>Add both images to preview transitions</Text>
      </View>
    );
  }

  return (
    <View style={styles.panelContainer}>
      <View style={styles.previewSection}>
        <TransitionPreview
          beforeImage={beforeImage}
          afterImage={afterImage}
          transition={transition}
          isPlaying={isPlaying}
          onPlayToggle={handlePlayToggle}
        />
      </View>
      
      <View style={styles.selectorSection}>
        <TransitionSelector
          selectedTransition={transition}
          onTransitionSelect={handleTransitionSelect}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  transitionContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  transitionImage: {
    width: '100%',
    height: '100%',
  },
  baseImage: {
    position: 'absolute',
  },
  overlayImage: {
    position: 'absolute',
  },
  slideContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  swipeContainer: {
    position: 'absolute',
    height: '100%',
    overflow: 'hidden',
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  splitHalf: {
    flex: 1,
    overflow: 'hidden',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  playButtonActive: {
    backgroundColor: '#4A90E2',
  },
  
  // Selector Styles
  selectorContainer: {
    backgroundColor: '#FFFFFF',
  },
  selectorHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  transitionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  transitionOption: {
    width: (screenWidth - 56) / 2,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  transitionOptionSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  transitionIcon: {
    marginBottom: 8,
  },
  transitionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  transitionDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  
  // Panel Styles
  panelContainer: {
    flex: 1,
  },
  previewSection: {
    flex: 1,
    minHeight: 200,
  },
  selectorSection: {
    maxHeight: 300,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default TransitionPreview;