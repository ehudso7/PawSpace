import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card } from 'react-native-paper';

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderSkeletonCard = (index: number) => (
    <Card key={index} style={styles.card}>
      <Animated.View style={[styles.imageSkeleton, { opacity }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.badgeSkeleton, { opacity }]} />
          <Animated.View style={[styles.distanceSkeleton, { opacity }]} />
        </View>
        <Animated.View style={[styles.titleSkeleton, { opacity }]} />
        <Animated.View style={[styles.titleSkeletonShort, { opacity }]} />
        <View style={styles.providerRow}>
          <Animated.View style={[styles.avatarSkeleton, { opacity }]} />
          <View style={styles.providerInfo}>
            <Animated.View style={[styles.nameSkeleton, { opacity }]} />
            <Animated.View style={[styles.ratingSkeleton, { opacity }]} />
          </View>
        </View>
        <View style={styles.priceRow}>
          <Animated.View style={[styles.priceSkeleton, { opacity }]} />
          <Animated.View style={[styles.buttonSkeleton, { opacity }]} />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => renderSkeletonCard(index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  imageSkeleton: {
    height: 200,
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeSkeleton: {
    width: 80,
    height: 28,
    backgroundColor: '#E0E0E0',
    borderRadius: 14,
  },
  distanceSkeleton: {
    width: 40,
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  titleSkeleton: {
    width: '100%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  titleSkeletonShort: {
    width: '60%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarSkeleton: {
    width: 32,
    height: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  nameSkeleton: {
    width: 120,
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 4,
  },
  ratingSkeleton: {
    width: 80,
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSkeleton: {
    width: 100,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  buttonSkeleton: {
    width: 80,
    height: 36,
    backgroundColor: '#E0E0E0',
    borderRadius: 18,
  },
});