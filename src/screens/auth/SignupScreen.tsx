import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { theme } from '@/constants/theme';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, loading, error: authError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const validateForm = () => {
    const newErrors: { fullName?: string; email?: string; password?: string; confirmPassword?: string } = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    const result = await signUp(email, password, fullName);
    if (result.success) {
      // Navigation handled by auth state change
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {authError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{authError}</Text>
            </View>
          )}

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors({ ...errors, fullName: undefined });
            }}
            autoCapitalize="words"
            error={errors.fullName}
            editable={!loading}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            editable={!loading}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password}
            editable={!loading}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            error={errors.confirmPassword}
            editable={!loading}
          />

          <Button
            title={loading ? 'Creating account...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={loading}
            style={styles.button}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 32,
  },
  errorContainer: {
    backgroundColor: theme.colors.errorBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignupScreen;