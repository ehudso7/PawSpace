import { validateConfig } from './src/config/appConfig';

// Validate configuration on app startup
const configValidation = validateConfig();

if (!configValidation.valid) {
  console.error('?? Configuration Errors:');
  configValidation.errors.forEach(error => {
    console.error(`  - ${error}`);
  });
  console.error('\nPlease check your .env file and ensure all required variables are set.');
  
  // In development, show warnings but don't crash
  // In production, this should fail hard
  if (process.env.EXPO_PUBLIC_APP_ENV === 'production') {
    throw new Error('Invalid configuration. Please fix the errors above.');
  }
}

export default configValidation;
