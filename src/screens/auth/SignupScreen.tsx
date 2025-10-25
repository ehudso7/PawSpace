import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Snackbar,
  ActivityIndicator,
  Checkbox,
  ProgressBar,
  RadioButton,
} from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateLocation,
  validateConfirmPassword,
  validatePhone,
} from '../../utils/validators';
import { SignUpData } from '../../types';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
  onSignupSuccess: () => void;
}

type UserType = 'pet_owner' | 'service_provider';

interface SignupFormData {
  userType: UserType | null;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  location: string;
  bio: string;
  avatarUri: string | null;
  termsAccepted: boolean;
}

const STEPS = [
  { id: 1, title: 'User Type', description: 'Choose your account type' },
  { id: 2, title: 'Account', description: 'Create your account' },
  { id: 3, title: 'Profile', description: 'Tell us about yourself' },
  { id: 4, title: 'Photo', description: 'Add a profile picture' },
];

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onNavigateToLogin,
  onSignupSuccess,
}) => {
  const { signUp, selectImage, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({
    userType: null,
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: '',
    bio: '',
    avatarUri: null,
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.userType) {
          newErrors.userType = 'Please select a user type';
        }
        break;

      case 2:
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password.trim()) {
          newErrors.password = 'Password is required';
        } else {
          const passwordValidation = validatePassword(formData.password);
          if (!passwordValidation.valid) {
            newErrors.password = passwordValidation.errors[0];
          }
        }

        if (!formData.confirmPassword.trim()) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else {
          const confirmPasswordValidation = validateConfirmPassword(
            formData.password,
            formData.confirmPassword
          );
          if (!confirmPasswordValidation.valid) {
            newErrors.confirmPassword = confirmPasswordValidation.errors[0];
          }
        }
        break;

      case 3:
        if (!formData.fullName.trim()) {
          newErrors.fullName = 'Full name is required';
        } else {
          const nameValidation = validateName(formData.fullName);
          if (!nameValidation.valid) {
            newErrors.fullName = nameValidation.errors[0];
          }
        }

        if (formData.phone.trim() && !validatePhone(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.location.trim()) {
          newErrors.location = 'Location is required';
        } else {
          const locationValidation = validateLocation(formData.location);
          if (!locationValidation.valid) {
            newErrors.location = locationValidation.errors[0];
          }
        }
        break;

      case 4:
        if (!formData.termsAccepted) {
          newErrors.terms = 'You must accept the terms of service';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSignup();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async () => {
    if (!formData.userType) {
      setSnackbarMessage('Please select a user type');
      setSnackbarVisible(true);
      return;
    }

    const signupData: SignUpData = {
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
      profile: {
        full_name: formData.fullName,
        phone: formData.phone || undefined,
        location: formData.location,
        bio: formData.bio || undefined,
      },
    };

    const { success, error } = await signUp(signupData);

    if (success) {
      onSignupSuccess();
    } else {
      setSnackbarMessage(error || 'Signup failed. Please try again.');
      setSnackbarVisible(true);
    }
  };

  const handleImageSelection = async () => {
    const { uri, error } = await selectImage();
    if (error) {
      setSnackbarMessage(error);
      setSnackbarVisible(true);
    } else if (uri) {
      setFormData(prev => ({ ...prev, avatarUri: uri }));
    }
  };

  const updateFormData = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Title style={styles.stepTitle}>Choose Your Account Type</Title>
      <Paragraph style={styles.stepDescription}>
        Select the type of account that best describes you
      </Paragraph>

      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[
            styles.userTypeCard,
            formData.userType === 'pet_owner' && styles.userTypeCardSelected,
          ]}
          onPress={() => updateFormData('userType', 'pet_owner')}
        >
          <Text style={styles.userTypeEmoji}>🐕</Text>
          <Title style={styles.userTypeTitle}>Pet Owner</Title>
          <Paragraph style={styles.userTypeDescription}>
            Find and book services for your beloved pets
          </Paragraph>
          <RadioButton
            value="pet_owner"
            status={formData.userType === 'pet_owner' ? 'checked' : 'unchecked'}
            onPress={() => updateFormData('userType', 'pet_owner')}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.userTypeCard,
            formData.userType === 'service_provider' && styles.userTypeCardSelected,
          ]}
          onPress={() => updateFormData('userType', 'service_provider')}
        >
          <Text style={styles.userTypeEmoji}>🏥</Text>
          <Title style={styles.userTypeTitle}>Service Provider</Title>
          <Paragraph style={styles.userTypeDescription}>
            Offer your services to pet owners in your area
          </Paragraph>
          <RadioButton
            value="service_provider"
            status={formData.userType === 'service_provider' ? 'checked' : 'unchecked'}
            onPress={() => updateFormData('userType', 'service_provider')}
          />
        </TouchableOpacity>
      </View>

      {errors.userType && (
        <Text style={styles.errorText}>{errors.userType}</Text>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Title style={styles.stepTitle}>Create Your Account</Title>
      <Paragraph style={styles.stepDescription}>
        Enter your email and create a secure password
      </Paragraph>

      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => updateFormData('email', text)}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={styles.input}
        error={!!errors.email}
        disabled={loading}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => updateFormData('password', text)}
        mode="outlined"
        secureTextEntry
        autoComplete="password"
        style={styles.input}
        error={!!errors.password}
        disabled={loading}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => updateFormData('confirmPassword', text)}
        mode="outlined"
        secureTextEntry
        autoComplete="password"
        style={styles.input}
        error={!!errors.confirmPassword}
        disabled={loading}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Title style={styles.stepTitle}>Tell Us About Yourself</Title>
      <Paragraph style={styles.stepDescription}>
        Help other users get to know you better
      </Paragraph>

      <TextInput
        label="Full Name"
        value={formData.fullName}
        onChangeText={(text) => updateFormData('fullName', text)}
        mode="outlined"
        autoComplete="name"
        style={styles.input}
        error={!!errors.fullName}
        disabled={loading}
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <TextInput
        label="Phone Number (Optional)"
        value={formData.phone}
        onChangeText={(text) => updateFormData('phone', text)}
        mode="outlined"
        keyboardType="phone-pad"
        autoComplete="tel"
        style={styles.input}
        error={!!errors.phone}
        disabled={loading}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <TextInput
        label="Location"
        value={formData.location}
        onChangeText={(text) => updateFormData('location', text)}
        mode="outlined"
        autoComplete="address-line1"
        style={styles.input}
        error={!!errors.location}
        disabled={loading}
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      <TextInput
        label="Bio (Optional)"
        value={formData.bio}
        onChangeText={(text) => updateFormData('bio', text)}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        disabled={loading}
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Title style={styles.stepTitle}>Add a Profile Picture</Title>
      <Paragraph style={styles.stepDescription}>
        Upload a photo to help others recognize you (Optional)
      </Paragraph>

      <View style={styles.avatarContainer}>
        {formData.avatarUri ? (
          <Image source={{ uri: formData.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>📷</Text>
          </View>
        )}
        <Button
          mode="outlined"
          onPress={handleImageSelection}
          style={styles.avatarButton}
          disabled={loading}
        >
          {formData.avatarUri ? 'Change Photo' : 'Select Photo'}
        </Button>
      </View>

      <View style={styles.termsContainer}>
        <Checkbox
          status={formData.termsAccepted ? 'checked' : 'unchecked'}
          onPress={() => updateFormData('termsAccepted', !formData.termsAccepted)}
          disabled={loading}
        />
        <Text style={styles.termsText}>
          I agree to the{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
      {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Join PawSpace</Title>
              <Paragraph style={styles.subtitle}>
                Create your account in just a few steps
              </Paragraph>

              <View style={styles.progressContainer}>
                <ProgressBar
                  progress={currentStep / STEPS.length}
                  color="#2E7D32"
                  style={styles.progressBar}
                />
                <Text style={styles.progressText}>
                  Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                </Text>
              </View>

              {renderCurrentStep()}

              <View style={styles.buttonContainer}>
                {currentStep > 1 && (
                  <Button
                    mode="outlined"
                    onPress={handlePrevious}
                    style={styles.previousButton}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={handleNext}
                  style={styles.nextButton}
                  disabled={loading}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : currentStep === STEPS.length ? (
                    'Create Account'
                  ) : (
                    'Next'
                  )}
                </Button>
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Button
                  mode="text"
                  onPress={onNavigateToLogin}
                  disabled={loading}
                  style={styles.loginButton}
                >
                  Sign In
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
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
    padding: 20,
  },
  content: {
    flex: 1,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  stepContainer: {
    minHeight: 300,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  userTypeContainer: {
    gap: 16,
  },
  userTypeCard: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  userTypeCardSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#f1f8e9',
  },
  userTypeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  userTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  userTypeDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholderText: {
    fontSize: 48,
  },
  avatarButton: {
    borderRadius: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  termsLink: {
    color: '#2E7D32',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  previousButton: {
    flex: 1,
    borderRadius: 8,
  },
  nextButton: {
    flex: 1,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    marginLeft: -8,
  },
  snackbar: {
    backgroundColor: '#d32f2f',
  },
});