/**
 * Example usage of the useAuth hook
 * 
 * This file demonstrates various use cases for the authentication hook
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from './src/hooks/useAuth';

/**
 * Example 1: Simple Login Component
 */
export const SimpleLoginExample = () => {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    const success = await signIn(email, password);
    if (success) {
      console.log('Login successful!');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>
    </View>
  );
};

/**
 * Example 2: User Profile Display
 */
export const UserProfileExample = () => {
  const { user, signOut, loading } = useAuth();

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{user.profile.full_name}</Text>
      <Text>{user.email}</Text>
      <Text>Type: {user.user_type}</Text>
      {user.profile.phone && <Text>Phone: {user.profile.phone}</Text>}
      {user.profile.location && <Text>Location: {user.profile.location}</Text>}
      
      <Button
        mode="contained"
        onPress={signOut}
        loading={loading}
        style={styles.button}
      >
        Sign Out
      </Button>
    </View>
  );
};

/**
 * Example 3: Protected Component
 * Only renders if user is authenticated
 */
export const ProtectedComponentExample = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>Please log in to access this feature</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>This content is only visible to authenticated users</Text>
      <Text>Welcome, {user.profile.full_name}!</Text>
    </View>
  );
};

/**
 * Example 4: Role-Based Component
 * Shows different content based on user type
 */
export const RoleBasedExample = () => {
  const { user } = useAuth();

  if (!user) {
    return <Text>Please log in</Text>;
  }

  if (user.user_type === 'pet_owner') {
    return (
      <View style={styles.container}>
        <Text variant="headlineSmall">Pet Owner Dashboard</Text>
        <Text>Find services for your pets</Text>
        {/* Pet owner specific content */}
      </View>
    );
  }

  if (user.user_type === 'service_provider') {
    return (
      <View style={styles.container}>
        <Text variant="headlineSmall">Service Provider Dashboard</Text>
        <Text>Manage your services and bookings</Text>
        {/* Service provider specific content */}
      </View>
    );
  }

  return null;
};

/**
 * Example 5: Auto-refresh User Data
 */
export const AutoRefreshExample = () => {
  const { user, refreshUser } = useAuth();

  React.useEffect(() => {
    // Refresh user data when component mounts
    refreshUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{user?.profile.full_name || 'Loading...'}</Text>
      <Button mode="outlined" onPress={refreshUser}>
        Refresh Profile
      </Button>
    </View>
  );
};

/**
 * Example 6: Error Handling
 */
export const ErrorHandlingExample = () => {
  const { signIn, error, clearError, loading } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    // Clear any existing errors
    clearError();
    
    const success = await signIn(email, password);
    
    if (success) {
      console.log('Login successful!');
      // Navigate or perform other actions
    } else {
      console.log('Login failed:', error);
      // Error is already displayed via the hook
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError(); // Clear error when user types
        }}
        mode="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError(); // Clear error when user types
        }}
        secureTextEntry
        mode="outlined"
      />
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <Button mode="text" onPress={clearError}>
            Dismiss
          </Button>
        </View>
      )}
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  button: {
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  error: {
    color: '#c62828',
    flex: 1,
  },
});
