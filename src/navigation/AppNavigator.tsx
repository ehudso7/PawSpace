import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import type { RootStackParamList } from '../types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'pawspace://',
    'https://pawspace.app',
    // Allow overriding via env at runtime if provided
    // @ts-expect-error - React Native will ignore undefined
    process.env.EXPO_PUBLIC_DEEP_LINK_PREFIX || process.env.DEEPLINK_PREFIX,
  ].filter(Boolean) as string[],
  config: {
    initialRouteName: 'Auth',
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
          HomeTab: {
            screens: {
              Feed: '',
              PostDetails: 'post/:postId',
            },
          },
          BookTab: {
            screens: {
              ServiceList: 'book',
              ServiceDetails: 'service/:serviceId',
              BookingCheckout: 'checkout',
            },
          },
          CreateTab: {
            screens: {
              ImageSelector: 'create',
              CreatePost: 'create/post',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile/:userId?',
              EditProfile: 'profile/edit',
              Settings: 'settings',
            },
          },
        },
      },
    },
  },
};

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setIsAuthenticated(Boolean(data.session));
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsAuthenticated(false);
        setIsLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setIsAuthenticated(Boolean(session));
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={TabNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppNavigator;
