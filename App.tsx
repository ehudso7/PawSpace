import React from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AppNavigator } from '@/navigation';
import { AppQueryProvider } from '@/providers/QueryProvider';

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <AppQueryProvider>
        <AppNavigator />
      </AppQueryProvider>
    </PaperProvider>
  );
}
