import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button } from 'react-native-paper';

interface Props { navigation: any }

const { width } = Dimensions.get('window');

const slides = [
  { title: 'Welcome to PawSpace', desc: 'Find trusted care for your furry friends.' },
  { title: 'Offer Your Services', desc: 'Become a service provider and grow your business.' },
  { title: 'Safe and Secure', desc: 'Verified profiles, reviews, and secure payments.' },
];

const FIRST_LAUNCH_KEY = 'pawspace_first_launch_seen';

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      if (seen) {
        navigation.replace('Login');
      } else {
        setReady(true);
      }
    })();
  }, [navigation]);

  const onGetStarted = useCallback(async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    navigation.replace('Signup');
  }, [navigation]);

  const onSkip = useCallback(async () => {
    await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    navigation.replace('Login');
  }, [navigation]);

  if (!ready) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const ix = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(ix);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((s, i) => (
          <View key={i} style={[styles.slide, { width }] }>
            <Text variant="headlineMedium" style={styles.title}>{s.title}</Text>
            <Text style={styles.desc}>{s.desc}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        {index < slides.length - 1 ? (
          <Button onPress={onSkip}>Skip</Button>
        ) : (
          <Button mode="contained" onPress={onGetStarted}>Get Started</Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48, paddingBottom: 24 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { textAlign: 'center', marginBottom: 12 },
  desc: { textAlign: 'center', color: '#555' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc' },
  dotActive: { backgroundColor: '#0a7' },
  actions: { alignItems: 'center', marginTop: 16 },
});
