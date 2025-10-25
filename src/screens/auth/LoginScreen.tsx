import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';
import { SignInData } from '../../types';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn, loading, error, resetPassword } = useAuth();
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    const success = await signIn(formData);
    if (success) {
      // Navigation will be handled by the auth state change
      // in your main App component or navigation container
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address first.');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsResettingPassword(true);
    const success = await resetPassword(formData.email);
    setIsResettingPassword(false);

    if (success) {
      Alert.alert(
        'Password Reset',
        'Password reset instructions have been sent to your email address.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSignUpNavigation = () => {
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title}>Welcome to PawSpace</Title>
            <Paragraph style={styles.subtitle}>
              Sign in to connect with pet services in your area
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.form}>
                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if (formErrors.email) {
                      setFormErrors({ ...formErrors, email: '' });
                    }
                  }}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!formErrors.email}
                  disabled={loading}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!formErrors.email}>
                  {formErrors.email}
                </HelperText>

                <TextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    if (formErrors.password) {
                      setFormErrors({ ...formErrors, password: '' });
                    }
                  }}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  error={!!formErrors.password}
                  disabled={loading}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!formErrors.password}>
                  {formErrors.password}
                </HelperText>

                {error && (
                  <HelperText type="error" visible={true} style={styles.errorText}>
                    {error}
                  </HelperText>
                )}

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  disabled={loading}
                  style={styles.loginButton}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? <ActivityIndicator color="white" /> : 'Sign In'}
                </Button>

                <Button
                  mode="text"
                  onPress={handleForgotPassword}
                  disabled={loading || isResettingPassword}
                  style={styles.forgotButton}
                >
                  {isResettingPassword ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    'Forgot Password?'
                  )}
                </Button>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Button
              mode="text"
              onPress={handleSignUpNavigation}
              disabled={loading}
              style={styles.signUpButton}
            >
              Sign Up
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  form: {
    paddingVertical: 10,
  },
  input: {
    marginBottom: 5,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  signUpButton: {
    marginLeft: 5,
  },
});