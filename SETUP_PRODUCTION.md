# ?? PawSpace Production Setup Guide

Complete step-by-step instructions to get your app production-ready.

---

## ?? Quick Start Checklist

- [ ] Step 1: Create Supabase Project
- [ ] Step 2: Set up Stripe Account
- [ ] Step 3: Configure Environment Variables
- [ ] Step 4: Set up EAS Project
- [ ] Step 5: Configure Backend API
- [ ] Step 6: Set up Error Tracking (Sentry)
- [ ] Step 7: Test Configuration
- [ ] Step 8: Build for Production

---

## Step 1: Create Supabase Project

### 1.1 Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
   - Project name: `pawspace` (or your preferred name)
   - Database password: **Save this securely!**
   - Region: Choose closest to your users

### 1.2 Get Your Credentials
1. Go to **Settings** ? **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 1.3 Set Up Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Open `supabase-setup.sql` in your project root
3. Copy and paste the SQL into the editor
4. Run the SQL to create tables and policies

### 1.4 Set Up Storage Buckets
1. Go to **Storage** in Supabase dashboard
2. Create buckets:
   - `avatars` (public)
   - `transformations` (public)
   - `services` (public)
3. Set up storage policies (see Supabase docs)

**? You'll need:**
- `EXPO_PUBLIC_SUPABASE_URL`: Your project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your anon key

---

## Step 2: Set up Stripe Account

### 2.1 Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete business verification (required for production)

### 2.2 Get API Keys
1. Go to **Developers** ? **API keys**
2. Copy your **Publishable key** (starts with `pk_live_...` for production)
   - ?? Use test keys (`pk_test_...`) for development
   - Use live keys (`pk_live_...`) for production

### 2.3 Set Up Webhooks (Backend Required)
1. Go to **Developers** ? **Webhooks**
2. Add endpoint: `https://your-api.com/api/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_method.attached`

**? You'll need:**
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your publishable key

---

## Step 3: Configure Environment Variables

### 3.1 Run Setup Script
```bash
npm run setup
# or
./setup-production.sh
```

This will create a `.env` file from `.env.example`.

### 3.2 Fill in Required Variables

Open `.env` and fill in these **REQUIRED** variables:

```bash
# Supabase (REQUIRED)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# API (REQUIRED for production)
EXPO_PUBLIC_API_BASE_URL=https://api.pawspace.com

# Stripe (REQUIRED for production)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App Configuration
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_APP_VERSION=1.0.0

# Optional: Google Maps (if using maps)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Optional: Cloudinary (if using image processing)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_API_KEY=your-api-key

# Feature Flags
EXPO_PUBLIC_ENABLE_PREMIUM_FEATURES=true
EXPO_PUBLIC_ENABLE_VIDEO_TRANSFORMATIONS=false
EXPO_PUBLIC_ENABLE_LIVE_CHAT=true

# Development (set to false for production)
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_ENABLE_FLIPPER=false
```

### 3.3 Validate Configuration
```bash
npm run validate-env
```

This will check if all required variables are set.

---

## Step 4: Set up EAS Project

### 4.1 Install EAS CLI
```bash
npm install -g eas-cli
```

### 4.2 Login to Expo
```bash
eas login
```

### 4.3 Initialize EAS Project
```bash
eas init
```

This will:
- Create an EAS project
- Generate a project ID
- Update `app.json` with your project ID

### 4.4 Configure Build Profiles
The `eas.json` file is already configured with:
- **development**: For development builds
- **preview**: For internal testing
- **production**: For App Store/Play Store

### 4.5 Update app.json
After running `eas init`, update `app.json`:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id-from-eas-init"
      }
    },
    "owner": "your-expo-username"
  }
}
```

---

## Step 5: Configure Backend API

### 5.1 Deploy Your Backend
Your backend needs to handle:

**Required Endpoints:**
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `GET /api/payments/methods` - Get saved payment methods
- `POST /api/payments/save-method` - Save payment method
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/cancel` - Cancel booking
- `GET /api/pets/my` - Get user pets
- `GET /api/services/:id` - Get service details
- `GET /api/providers/:id` - Get provider details

### 5.2 Set Environment Variable
Update `.env`:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-production-api.com
```

### 5.3 Test API Connection
```bash
curl https://your-production-api.com/api/health
```

---

## Step 6: Set up Error Tracking (Sentry)

### 6.1 Create Sentry Account
1. Go to [https://sentry.io](https://sentry.io)
2. Sign up and create a project
3. Select **React Native** as platform

### 6.2 Install Sentry
```bash
npm install @sentry/react-native
```

### 6.3 Configure Sentry (Optional)
Add to `App.tsx`:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
});
```

**Note:** This is optional but highly recommended for production.

---

## Step 7: Test Configuration

### 7.1 Validate Environment
```bash
npm run validate-env
```

### 7.2 Start Development Server
```bash
npm start
```

### 7.3 Test on Device
```bash
# iOS
npm run ios

# Android
npm run android
```

### 7.4 Test Critical Flows
- [ ] User registration
- [ ] User login
- [ ] Create booking
- [ ] Process payment
- [ ] View bookings

---

## Step 8: Build for Production

### 8.1 Build iOS
```bash
eas build --platform ios --profile production
```

### 8.2 Build Android
```bash
eas build --platform android --profile production
```

### 8.3 Submit to App Stores

**iOS:**
```bash
eas submit --platform ios --profile production
```

**Android:**
```bash
eas submit --platform android --profile production
```

**Note:** You'll need:
- Apple Developer account ($99/year)
- Google Play Developer account ($25 one-time)

---

## ?? Security Checklist

Before launching:

- [ ] All API keys are in `.env`, not in code
- [ ] `.env` is in `.gitignore`
- [ ] Supabase RLS policies are configured
- [ ] Stripe webhooks are set up
- [ ] HTTPS enforced for all API calls
- [ ] Input validation on all forms
- [ ] Rate limiting configured on backend

---

## ?? App Store Requirements

### iOS App Store
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] App icons (all sizes)
- [ ] Screenshots (multiple sizes)
- [ ] App description
- [ ] Keywords
- [ ] Support URL

### Google Play Store
- [ ] Privacy policy URL
- [ ] App icons
- [ ] Screenshots
- [ ] Feature graphic
- [ ] App description
- [ ] Content rating

---

## ?? Troubleshooting

### Environment Variables Not Loading
- Make sure variables start with `EXPO_PUBLIC_`
- Restart Expo dev server after changing `.env`
- Clear cache: `expo start -c`

### Supabase Connection Issues
- Verify URL and key are correct
- Check Supabase project is active
- Verify RLS policies allow access

### Stripe Payment Issues
- Use test keys for development
- Verify backend endpoints are deployed
- Check Stripe dashboard for errors

### Build Failures
- Check `eas.json` configuration
- Verify all dependencies are installed
- Check EAS build logs

---

## ?? Need Help?

1. Check `PRODUCTION_READINESS.md` for detailed checklist
2. Review error messages carefully
3. Check Expo/EAS documentation
4. Verify all environment variables are set

---

**Ready to launch?** Run through all steps above, then test thoroughly before releasing to users!
