import React from 'react';
import { LinkingOptions, NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import type { RootStackParamList } from '../types/navigation';
import { supabase } from '../lib/supabase';
import { ActivityIndicator, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
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
          HomeTab: {
            screens: {
              Feed: 'home',
              PostDetails: 'post/:postId',
            },
          },
          BookTab: {
            screens: {
              ServiceList: 'book',
              ServiceDetails: 'service/:serviceId',
              BookingCheckout: 'checkout/:serviceId/:date',
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
              Profile: 'profile',
              EditProfile: 'profile/edit',
              Settings: 'settings',
            },
          },
        },
      },
    },
  },
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const paperTheme = {
  ...MD3LightTheme,
};

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!isMounted) return;
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading || isAuthenticated === null) {
    return (
      <PaperProvider theme={paperTheme}>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer linking={linking} theme={navigationTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <RootStack.Screen name="Main" component={TabNavigator} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppNavigator;
