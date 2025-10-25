import React, { useEffect, useMemo, useState } from 'react';
import { LinkingOptions, NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import type { RootStackParamList } from '../types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        setIsAuthenticated(!!data.session);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const linking: LinkingOptions<RootStackParamList> = useMemo(
    () => ({
      prefixes: [
        'pawspace://',
        'https://pawspace.app',
      ],
      config: {
        initialRouteName: 'Main',
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
                  Feed: 'home',
                  PostDetail: 'post/:postId',
                },
              },
              BookStack: {
                screens: {
                  ServiceList: 'book',
                  ServiceDetail: 'service/:serviceId',
                },
              },
              CreateStack: {
                screens: {
                  ImageSelector: 'create',
                  CreatePreview: 'create/preview',
                },
              },
              ProfileStack: {
                screens: {
                  Profile: 'profile',
                  Settings: 'settings',
                },
              },
            },
          },
        },
      },
    }),
    []
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking} theme={DefaultTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={TabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
