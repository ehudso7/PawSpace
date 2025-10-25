import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import { QueryProvider } from './src/providers/QueryProvider';
import { ServiceListScreen } from './src/screens/booking/ServiceListScreen';

const Stack = createStackNavigator();

// Mock screens for navigation
function ProviderProfileScreen() {
  return null; // Placeholder
}

function BookingFlowScreen() {
  return null; // Placeholder
}

export default function App() {
  return (
    <QueryProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="ServiceList"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="ServiceList"
              component={ServiceListScreen}
              options={{
                title: 'Pet Services',
                headerStyle: {
                  backgroundColor: '#2196F3',
                },
                headerTintColor: '#FFFFFF',
              }}
            />
            <Stack.Screen
              name="ProviderProfile"
              component={ProviderProfileScreen}
              options={{
                title: 'Provider Profile',
              }}
            />
            <Stack.Screen
              name="BookingFlow"
              component={BookingFlowScreen}
              options={{
                title: 'Book Service',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryProvider>
  );
}