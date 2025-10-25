import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Linking } from 'react-native';

import { RootStackParamList, LinkingConfig } from '../types/navigation';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

// Deep linking configuration
const linking = {
  prefixes: ['pawspace://', 'https://pawspace.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Signup: 'signup',
          Onboarding: 'onboarding',
        },
      },
      Main: {
        screens: {
          HomeStack: {
            screens: {
              FeedScreen: 'home',
              PostDetail: 'post/:postId',
              UserProfile: 'user/:userId',
            },
          },
          BookStack: {
            screens: {
              ServiceListScreen: 'services',
              ServiceDetail: 'service/:serviceId',
              BookingForm: 'book/:serviceId',
              BookingConfirmation: 'booking/:bookingId',
            },
          },
          CreateStack: {
            screens: {
              ImageSelectorScreen: 'create',
              PostEditor: 'create/post',
              ServiceEditor: 'create/service',
            },
          },
          ProfileStack: {
            screens: {
              ProfileScreen: 'profile',
              EditProfile: 'profile/edit',
              Settings: 'settings',
              MyBookings: 'bookings',
              MyServices: 'my-services',
              Notifications: 'notifications',
            },
          },
        },
      },
    },
  } as LinkingConfig,
};

const LoadingScreen: React.FC = () => {
  const theme = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary} 
      />
    </View>
  );
};

const AppNavigator: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<string | undefined>(undefined);
  const theme = useTheme();

  // Custom theme for navigation
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      notification: theme.colors.error,
    },
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Handle deep linking
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      // The NavigationContainer will handle the routing automatically
      // based on our linking configuration
    };

    // Get initial URL if app was opened via deep link
    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink(initialUrl);
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    getInitialURL();

    // Listen for incoming links when app is running
    const linkingListener = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      linkingListener?.remove();
    };
  }, []);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer 
      theme={navigationTheme}
      linking={linking}
      fallback={<LoadingScreen />}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {session ? (
          <Stack.Screen 
            name="Main" 
            component={TabNavigator}
            options={{
              gestureEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{
              gestureEnabled: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;