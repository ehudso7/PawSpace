/**
 * Signup Screen Component
 * Multi-step registration form for new users
 */

import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Headline,
  HelperText,
  Card,
  ProgressBar,
  Checkbox,
  IconButton,
} from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { UserType } from '../../types';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateFullName,
  passwordsMatch,
} from '../../utils/validators';

interface SignupScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signUp, loading, error, clearError } = useAuth();
  
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  // Step 1: User type selection
  const [userType, setUserType] = useState<UserType | null>(null);
  
  // Step 2: Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Step 3: Profile info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  
  // Step 4: Terms and avatar
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Errors
  const [userTypeError, setUserTypeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [termsError, setTermsError] = useState('');
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Validate Step 1: User Type Selection
   */
  const validateStep1 = (): boolean => {
    setUserTypeError('');
    
    if (!userType) {
      setUserTypeError('Please select an account type');
      return false;
    }
    
    return true;
  };

  /**
   * Validate Step 2: Credentials
   */
  const validateStep2 = (): boolean => {
    let isValid = true;
    
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.errors.join('\n'));
      isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (!passwordsMatch(password, confirmPassword)) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };

  /**
   * Validate Step 3: Profile Info
   */
  const validateStep3 = (): boolean => {
    let isValid = true;
    
    setFullNameError('');
    setPhoneError('');
    
    // Validate full name
    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    } else if (!validateFullName(fullName)) {
      setFullNameError('Please enter a valid name');
      isValid = false;
    }
    
    // Validate phone (optional)
    if (phone && !validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    }
    
    return isValid;
  };

  /**
   * Validate Step 4: Terms
   */
  const validateStep4 = (): boolean => {
    setTermsError('');
    
    if (!acceptedTerms) {
      setTermsError('You must accept the terms of service to continue');
      return false;
    }
    
    return true;
  };

  /**
   * Handle next button press
   */
  const handleNext = () => {
    clearError();
    
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  /**
   * Handle back button press
   */
  const handleBack = () => {
    clearError();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      navigation.goBack();
    }
  };

  /**
   * Handle signup submission
   */
  const handleSignup = async () => {
    clearError();
    
    // Validate final step
    if (!validateStep4()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await signUp(
        email.trim(),
        password,
        userType!,
        {
          full_name: fullName.trim(),
          phone: phone.trim() || undefined,
          location: location.trim() || undefined,
        }
      );
      
      if (success) {
        console.log('Signup successful');
        // Navigation handled by auth state listener
      }
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Render Step 1: User Type Selection
   */
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Headline style={styles.stepHeadline}>Choose Your Account Type</Headline>
      <Text style={styles.stepSubtitle}>
        Select the option that best describes you
      </Text>
      
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          onPress={() => {
            setUserType('pet_owner');
            setUserTypeError('');
          }}
          style={styles.cardTouchable}
        >
          <Card
            style={[
              styles.userTypeCard,
              userType === 'pet_owner' && styles.userTypeCardSelected,
            ]}
          >
            <Card.Content style={styles.userTypeCardContent}>
              <IconButton
                icon="paw"
                size={48}
                iconColor={userType === 'pet_owner' ? '#6200ee' : '#666'}
              />
              <Text
                style={[
                  styles.userTypeTitle,
                  userType === 'pet_owner' && styles.userTypeTitleSelected,
                ]}
              >
                Pet Owner
              </Text>
              <Text style={styles.userTypeDescription}>
                Find trusted services for your pets
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            setUserType('service_provider');
            setUserTypeError('');
          }}
          style={styles.cardTouchable}
        >
          <Card
            style={[
              styles.userTypeCard,
              userType === 'service_provider' && styles.userTypeCardSelected,
            ]}
          >
            <Card.Content style={styles.userTypeCardContent}>
              <IconButton
                icon="briefcase"
                size={48}
                iconColor={userType === 'service_provider' ? '#6200ee' : '#666'}
              />
              <Text
                style={[
                  styles.userTypeTitle,
                  userType === 'service_provider' && styles.userTypeTitleSelected,
                ]}
              >
                Service Provider
              </Text>
              <Text style={styles.userTypeDescription}>
                Offer pet care services to owners
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
      
      <HelperText type="error" visible={!!userTypeError}>
        {userTypeError}
      </HelperText>
    </View>
  );

  /**
   * Render Step 2: Credentials
   */
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Headline style={styles.stepHeadline}>Create Your Account</Headline>
      <Text style={styles.stepSubtitle}>
        Enter your email and choose a secure password
      </Text>
      
      <View style={styles.form}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
            clearError();
          }}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={!!emailError}
          disabled={isSubmitting}
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!emailError}>
          {emailError}
        </HelperText>
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError('');
            clearError();
          }}
          mode="outlined"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoComplete="password"
          error={!!passwordError}
          disabled={isSubmitting}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
        />
        <HelperText type="error" visible={!!passwordError}>
          {passwordError}
        </HelperText>
        
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError('');
            clearError();
          }}
          mode="outlined"
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoComplete="password"
          error={!!confirmPasswordError}
          disabled={isSubmitting}
          left={<TextInput.Icon icon="lock-check" />}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          style={styles.input}
        />
        <HelperText type="error" visible={!!confirmPasswordError}>
          {confirmPasswordError}
        </HelperText>
      </View>
    </View>
  );

  /**
   * Render Step 3: Profile Info
   */
  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Headline style={styles.stepHeadline}>Tell Us About Yourself</Headline>
      <Text style={styles.stepSubtitle}>
        Help us personalize your experience
      </Text>
      
      <View style={styles.form}>
        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            setFullNameError('');
          }}
          mode="outlined"
          autoCapitalize="words"
          autoComplete="name"
          error={!!fullNameError}
          disabled={isSubmitting}
          left={<TextInput.Icon icon="account" />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!fullNameError}>
          {fullNameError}
        </HelperText>
        
        <TextInput
          label="Phone (Optional)"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setPhoneError('');
          }}
          mode="outlined"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={!!phoneError}
          disabled={isSubmitting}
          left={<TextInput.Icon icon="phone" />}
          style={styles.input}
        />
        <HelperText type="error" visible={!!phoneError}>
          {phoneError}
        </HelperText>
        
        <TextInput
          label="Location (Optional)"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          autoCapitalize="words"
          disabled={isSubmitting}
          left={<TextInput.Icon icon="map-marker" />}
          style={styles.input}
        />
        <HelperText type="info" visible={true}>
          This helps connect you with nearby services
        </HelperText>
      </View>
    </View>
  );

  /**
   * Render Step 4: Terms and Complete
   */
  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Headline style={styles.stepHeadline}>Almost Done!</Headline>
      <Text style={styles.stepSubtitle}>
        Review and accept our terms to complete signup
      </Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Account Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Account Type:</Text>
          <Text style={styles.summaryValue}>
            {userType === 'pet_owner' ? 'Pet Owner' : 'Service Provider'}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Email:</Text>
          <Text style={styles.summaryValue}>{email}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Name:</Text>
          <Text style={styles.summaryValue}>{fullName}</Text>
        </View>
        
        {phone && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phone:</Text>
            <Text style={styles.summaryValue}>{phone}</Text>
          </View>
        )}
        
        {location && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Location:</Text>
            <Text style={styles.summaryValue}>{location}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.termsContainer}>
        <Checkbox.Item
          label="I accept the Terms of Service and Privacy Policy"
          status={acceptedTerms ? 'checked' : 'unchecked'}
          onPress={() => {
            setAcceptedTerms(!acceptedTerms);
            setTermsError('');
          }}
          mode="android"
          labelStyle={styles.termsLabel}
        />
        <HelperText type="error" visible={!!termsError}>
          {termsError}
        </HelperText>
      </View>
    </View>
  );

  /**
   * Render current step
   */
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

  const isLoading = loading || isSubmitting;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
          disabled={isLoading}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Sign Up</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep} of {totalSteps}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Progress Bar */}
      <ProgressBar
        progress={currentStep / totalSteps}
        color="#6200ee"
        style={styles.progressBar}
      />
      
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {/* Current Step Content */}
          {renderCurrentStep()}
          
          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep < totalSteps ? (
              <Button
                mode="contained"
                onPress={handleNext}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Continue
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={handleSignup}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            )}
          </View>
          
          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  headerSpacer: {
    width: 48,
  },
  progressBar: {
    height: 4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  userTypeContainer: {
    gap: 16,
  },
  cardTouchable: {
    marginBottom: 8,
  },
  userTypeCard: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  userTypeCardSelected: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5f5',
  },
  userTypeCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  userTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 8,
  },
  userTypeTitleSelected: {
    color: '#6200ee',
  },
  userTypeDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  termsContainer: {
    marginBottom: 16,
  },
  termsLabel: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
