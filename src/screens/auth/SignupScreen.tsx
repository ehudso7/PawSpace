import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text, Button, TextInput, RadioButton, ProgressBar, Checkbox, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';

interface Props { navigation: any; }

type UserType = 'pet_owner' | 'service_provider';

export default function SignupScreen({ navigation }: Props) {
  const { signUp, loading, error, user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [userType, setUserType] = useState<UserType>('pet_owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const totalSteps = 4;
  const progress = useMemo(() => step / totalSteps, [step]);

  React.useEffect(() => {
    if (user) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [user, navigation]);

  const validateStep = useCallback((): boolean => {
    switch (step) {
      case 1:
        return true; // user type selection
      case 2: {
        if (!validateEmail(email)) { setFormError('Please enter a valid email.'); return false; }
        const { valid, errors } = validatePassword(password);
        if (!valid) { setFormError(errors[0]); return false; }
        if (password !== confirmPassword) { setFormError('Passwords do not match.'); return false; }
        return true;
      }
      case 3: {
        if (!fullName.trim()) { setFormError('Please enter your full name.'); return false; }
        if (phone && !validatePhone(phone)) { setFormError('Please enter a valid phone number.'); return false; }
        return true;
      }
      case 4: {
        if (!agree) { setFormError('You must accept the Terms of Service.'); return false; }
        return true;
      }
      default:
        return false;
    }
  }, [step, email, password, confirmPassword, fullName, phone, agree]);

  const onNext = useCallback(() => {
    setFormError(null);
    if (validateStep()) setStep((s) => Math.min(totalSteps, s + 1));
  }, [validateStep]);

  const onPrev = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      const uri = result.assets?.[0]?.uri;
      if (uri) setAvatarUri(uri);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    setFormError(null);
    if (!validateStep()) return;

    await signUp(
      email.trim(),
      password,
      userType,
      {
        full_name: fullName.trim(),
        phone: phone || undefined,
        location: location || undefined,
        avatar_url: undefined, // will be uploaded later in the profile screen
      }
    );
  }, [email, password, userType, fullName, phone, location, validateStep, signUp]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>Create your account</Text>
      <ProgressBar progress={progress} style={styles.progress} />

      {step === 1 && (
        <View>
          <Text variant="titleMedium" style={styles.stepTitle}>Choose your role</Text>
          <RadioButton.Group onValueChange={(v) => setUserType(v as UserType)} value={userType}>
            <View style={styles.cardRow}>
              <TouchableOpacity style={[styles.card, userType === 'pet_owner' && styles.cardSelected]} onPress={() => setUserType('pet_owner')}>
                <Text variant="titleMedium">Pet Owner</Text>
                <Text>Find trusted pet care providers.</Text>
                <RadioButton value="pet_owner" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.card, userType === 'service_provider' && styles.cardSelected]} onPress={() => setUserType('service_provider')}>
                <Text variant="titleMedium">Service Provider</Text>
                <Text>Offer pet sitting, walking, grooming and more.</Text>
                <RadioButton value="service_provider" />
              </TouchableOpacity>
            </View>
          </RadioButton.Group>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text variant="titleMedium" style={styles.stepTitle}>Account details</Text>
          <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
        </View>
      )}

      {step === 3 && (
        <View>
          <Text variant="titleMedium" style={styles.stepTitle}>Profile info</Text>
          <TextInput label="Full name" value={fullName} onChangeText={setFullName} style={styles.input} />
          <TextInput label="Location (optional)" value={location} onChangeText={setLocation} style={styles.input} />
          <TextInput label="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
        </View>
      )}

      {step === 4 && (
        <View>
          <Text variant="titleMedium" style={styles.stepTitle}>Profile picture</Text>
          <TouchableOpacity onPress={pickImage} style={styles.avatarPicker}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Text>Add a photo (optional)</Text>
            )}
          </TouchableOpacity>
          <View style={styles.termsRow}>
            <Checkbox status={agree ? 'checked' : 'unchecked'} onPress={() => setAgree((a) => !a)} />
            <Text>I agree to the Terms of Service</Text>
          </View>
        </View>
      )}

      {(formError || error) && <Text style={styles.errorText}>{formError || error}</Text>}

      <View style={styles.actionsRow}>
        {step > 1 && (
          <Button mode="outlined" onPress={onPrev} disabled={loading}>
            Back
          </Button>
        )}
        {step < totalSteps && (
          <Button mode="contained" onPress={onNext} disabled={loading}>
            Next
          </Button>
        )}
        {step === totalSteps && (
          <Button mode="contained" onPress={onSubmit} disabled={loading}>
            {loading ? <ActivityIndicator animating color="white" /> : 'Create account'}
          </Button>
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 16 }}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 16 },
  stepTitle: { marginBottom: 12 },
  progress: { marginBottom: 24 },
  input: { marginBottom: 12 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, gap: 12 },
  errorText: { color: '#B00020', marginTop: 8 },
  link: { color: '#0a7', textAlign: 'center' },
  cardRow: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 12 },
  cardSelected: { borderColor: '#0a7', backgroundColor: '#0a71' },
  avatarPicker: { height: 140, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
});
