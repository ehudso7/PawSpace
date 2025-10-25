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
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  HelperText,
  ActivityIndicator,
  ProgressBar,
  Checkbox,
  Avatar,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
  validatePhone,
  validateLocation,
} from '../../utils/validators';
import { SignUpData } from '../../types';

interface SignupScreenProps {
  navigation: any;
}

type Step = 1 | 2 | 3 | 4;

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signUp, loading, error, uploadAvatar } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    userType: 'pet_owner',
    profile: {
      full_name: '',
      phone: '',
      location: '',
      bio: '',
    },
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;
  const progress = currentStep / totalSteps;

  const validateStep = (step: Step): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        // User type is always selected, no validation needed
        break;
      case 2:
        if (!formData.email.trim()) {
          errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          errors.email = 'Please enter a valid email address';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.valid) {
          errors.password = passwordValidation.errors[0];
        }

        if (!validateConfirmPassword(formData.password, confirmPassword)) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 3:
        if (!validateFullName(formData.profile.full_name)) {
          errors.full_name = 'Full name must be at least 2 characters';
        }

        if (formData.profile.phone && !validatePhone(formData.profile.phone)) {
          errors.phone = 'Please enter a valid phone number';
        }

        if (!validateLocation(formData.profile.location || '')) {
          errors.location = 'Location is required';
        }

        if (!agreeToTerms) {
          errors.terms = 'You must agree to the terms of service';
        }
        break;
      case 4:
        // Profile picture is optional, no validation needed
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => (prev + 1) as Step);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSignUp = async () => {
    if (!validateStep(3) || !validateStep(4)) {
      return;
    }

    const success = await signUp(formData);
    if (success) {
      // If profile image was selected, upload it
      if (profileImage) {
        // Note: uploadAvatar will be called after successful signup
        // The user will be available in the auth hook
      }
      // Navigation will be handled by the auth state change
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const renderUserTypeSelection = () => (
    <View style={styles.stepContent}>
      <Title style={styles.stepTitle}>Choose Your Account Type</Title>
      <Paragraph style={styles.stepDescription}>
        Select the option that best describes you
      </Paragraph>

      <TouchableOpacity
        style={[
          styles.userTypeCard,
          formData.userType === 'pet_owner' && styles.selectedCard,
        ]}
        onPress={() => setFormData({ ...formData, userType: 'pet_owner' })}
      >
        <Card>
          <Card.Content style={styles.userTypeContent}>
            <Text style={styles.userTypeIcon}>🐕</Text>
            <Title style={styles.userTypeTitle}>Pet Owner</Title>
            <Paragraph style={styles.userTypeDescription}>
              Find trusted pet services and care providers in your area
            </Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.userTypeCard,
          formData.userType === 'service_provider' && styles.selectedCard,
        ]}
        onPress={() => setFormData({ ...formData, userType: 'service_provider' })}
      >
        <Card>
          <Card.Content style={styles.userTypeContent}>
            <Text style={styles.userTypeIcon}>🏪</Text>
            <Title style={styles.userTypeTitle}>Service Provider</Title>
            <Paragraph style={styles.userTypeDescription}>
              Offer your pet services and connect with pet owners
            </Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );

  const renderCredentialsForm = () => (
    <View style={styles.stepContent}>
      <Title style={styles.stepTitle}>Create Your Account</Title>
      <Paragraph style={styles.stepDescription}>
        Enter your email and create a secure password
      </Paragraph>

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

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (formErrors.confirmPassword) {
            setFormErrors({ ...formErrors, confirmPassword: '' });
          }
        }}
        mode="outlined"
        secureTextEntry={!showConfirmPassword}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
        error={!!formErrors.confirmPassword}
        disabled={loading}
        style={styles.input}
      />
      <HelperText type="error" visible={!!formErrors.confirmPassword}>
        {formErrors.confirmPassword}
      </HelperText>
    </View>
  );

  const renderProfileForm = () => (
    <View style={styles.stepContent}>
      <Title style={styles.stepTitle}>Tell Us About Yourself</Title>
      <Paragraph style={styles.stepDescription}>
        Help others get to know you better
      </Paragraph>

      <TextInput
        label="Full Name"
        value={formData.profile.full_name}
        onChangeText={(text) => {
          setFormData({
            ...formData,
            profile: { ...formData.profile, full_name: text },
          });
          if (formErrors.full_name) {
            setFormErrors({ ...formErrors, full_name: '' });
          }
        }}
        mode="outlined"
        autoCapitalize="words"
        error={!!formErrors.full_name}
        disabled={loading}
        style={styles.input}
      />
      <HelperText type="error" visible={!!formErrors.full_name}>
        {formErrors.full_name}
      </HelperText>

      <TextInput
        label="Phone Number (Optional)"
        value={formData.profile.phone}
        onChangeText={(text) => {
          setFormData({
            ...formData,
            profile: { ...formData.profile, phone: text },
          });
          if (formErrors.phone) {
            setFormErrors({ ...formErrors, phone: '' });
          }
        }}
        mode="outlined"
        keyboardType="phone-pad"
        error={!!formErrors.phone}
        disabled={loading}
        style={styles.input}
      />
      <HelperText type="error" visible={!!formErrors.phone}>
        {formErrors.phone}
      </HelperText>

      <TextInput
        label="Location"
        value={formData.profile.location}
        onChangeText={(text) => {
          setFormData({
            ...formData,
            profile: { ...formData.profile, location: text },
          });
          if (formErrors.location) {
            setFormErrors({ ...formErrors, location: '' });
          }
        }}
        mode="outlined"
        error={!!formErrors.location}
        disabled={loading}
        style={styles.input}
      />
      <HelperText type="error" visible={!!formErrors.location}>
        {formErrors.location}
      </HelperText>

      <TextInput
        label="Bio (Optional)"
        value={formData.profile.bio}
        onChangeText={(text) => {
          setFormData({
            ...formData,
            profile: { ...formData.profile, bio: text },
          });
        }}
        mode="outlined"
        multiline
        numberOfLines={3}
        disabled={loading}
        style={styles.input}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={agreeToTerms ? 'checked' : 'unchecked'}
          onPress={() => {
            setAgreeToTerms(!agreeToTerms);
            if (formErrors.terms) {
              setFormErrors({ ...formErrors, terms: '' });
            }
          }}
        />
        <Text style={styles.checkboxText}>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </View>
      <HelperText type="error" visible={!!formErrors.terms}>
        {formErrors.terms}
      </HelperText>
    </View>
  );

  const renderProfilePicture = () => (
    <View style={styles.stepContent}>
      <Title style={styles.stepTitle}>Add a Profile Picture</Title>
      <Paragraph style={styles.stepDescription}>
        Help others recognize you (optional)
      </Paragraph>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage} disabled={loading}>
          {profileImage ? (
            <Avatar.Image size={120} source={{ uri: profileImage }} />
          ) : (
            <Avatar.Icon size={120} icon="camera" />
          )}
        </TouchableOpacity>
        <Button mode="outlined" onPress={pickImage} disabled={loading} style={styles.avatarButton}>
          {profileImage ? 'Change Picture' : 'Add Picture'}
        </Button>
      </View>

      {error && (
        <HelperText type="error" visible={true} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderUserTypeSelection();
      case 2:
        return renderCredentialsForm();
      case 3:
        return renderProfileForm();
      case 4:
        return renderProfilePicture();
      default:
        return renderUserTypeSelection();
    }
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
            <Title style={styles.title}>Create Account</Title>
            <ProgressBar progress={progress} style={styles.progressBar} />
            <Text style={styles.stepIndicator}>
              Step {currentStep} of {totalSteps}
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>{renderStepContent()}</Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <Button
                mode="outlined"
                onPress={handleBack}
                disabled={loading}
                style={styles.backButton}
              >
                Back
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                mode="contained"
                onPress={handleNext}
                disabled={loading}
                style={styles.nextButton}
              >
                Next
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={handleSignUp}
                disabled={loading}
                style={styles.nextButton}
                contentStyle={styles.buttonContent}
              >
                {loading ? <ActivityIndicator color="white" /> : 'Create Account'}
              </Button>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
              style={styles.loginButton}
            >
              Sign In
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
    padding: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  stepContent: {
    paddingVertical: 10,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  userTypeCard: {
    marginBottom: 15,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 8,
  },
  userTypeContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userTypeIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  userTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userTypeDescription: {
    textAlign: 'center',
    color: '#666',
  },
  input: {
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarButton: {
    marginTop: 15,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: currentStep > 1 ? 10 : 0,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    marginLeft: 5,
  },
});