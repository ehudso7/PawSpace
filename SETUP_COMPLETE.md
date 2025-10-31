# ? Production Setup Complete - What I've Done & What You Need To Do

## ?? What I've Automated

### ? Configuration Files Created/Updated

1. **Centralized Configuration System** (`src/config/appConfig.ts`)
   - Single source of truth for all environment variables
   - Automatic validation on startup
   - Type-safe configuration access

2. **EAS Build Configuration** (`eas.json`)
   - Development, preview, and production build profiles
   - iOS and Android configurations
   - Ready for App Store submission

3. **Environment Template** (`.env.example`)
   - All required variables documented
   - Production-ready defaults

4. **Setup Script** (`setup-production.sh`)
   - Automated `.env` file creation
   - Helpful prompts and instructions

### ? Code Fixes

1. **Removed All Hardcoded URLs**
   - ? `src/services/bookings.ts` - Now uses environment variables
   - ? `src/services/booking.ts` - Now uses environment variables
   - ? `src/services/stripe.ts` - Now uses centralized config
   - ? `src/lib/supabase.ts` - Now uses centralized config
   - ? `src/utils/supabase.ts` - Now uses centralized config
   - ? `src/services/supabase.ts` - Fixed merge conflicts

2. **Fixed Merge Conflicts**
   - ? `App.tsx` - Resolved conflicts
   - ? `app.json` - Resolved conflicts
   - ? `.env.example` - Resolved conflicts
   - ? `src/utils/validators.ts` - Resolved conflicts

3. **Configuration Updates**
   - ? All services now use `APP_CONFIG` from `src/config/appConfig.ts`
   - ? Added validation for required environment variables
   - ? Added helpful error messages

### ? Documentation Created

1. **`SETUP_PRODUCTION.md`** - Complete step-by-step setup guide
2. **`PRODUCTION_READINESS.md`** - Detailed production checklist

---

## ?? What YOU Need To Do

Follow these steps in order:

### Step 1: Create Supabase Project ?? 15 minutes

1. Go to https://supabase.com and sign up
2. Create new project
3. Copy your **Project URL** and **anon key**
4. Run SQL from `supabase-setup.sql` in Supabase SQL Editor
5. Create storage buckets: `avatars`, `transformations`, `services`

**You'll need:**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Set up Stripe Account ?? 20 minutes

1. Go to https://stripe.com and sign up
2. Complete business verification (for production)
3. Copy your **Publishable key** (`pk_live_...` for production)
4. Set up webhooks on your backend (if you have one)

**You'll need:**
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Step 3: Configure Environment Variables ?? 10 minutes

```bash
# Run the setup script
npm run setup

# Or manually:
cp .env.example .env
# Then edit .env with your values
```

**Required variables to fill:**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_API_BASE_URL=https://your-api.com
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
EXPO_PUBLIC_APP_ENV=production
```

### Step 4: Set up EAS Project ?? 5 minutes

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Initialize project
eas init

# This will generate a project ID - update app.json with it
```

**Update `app.json`:**
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

### Step 5: Deploy Backend API ?? 2-8 hours

Your backend needs these endpoints:
- `POST /api/payments/create-intent`
- `GET /api/payments/methods`
- `POST /api/payments/save-method`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `GET /api/bookings/:id`
- `POST /api/bookings/:id/cancel`
- `GET /api/pets/my`
- `GET /api/services/:id`
- `GET /api/providers/:id`

**Update `.env`:**
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-production-api.com
```

### Step 6: Validate Configuration ?? 2 minutes

```bash
npm run validate-env
```

This will check if all required variables are set.

### Step 7: Test Everything ?? 30 minutes

```bash
# Start dev server
npm start

# Test on iOS
npm run ios

# Test on Android
npm run android
```

**Test these flows:**
- [ ] User registration
- [ ] User login
- [ ] Create booking
- [ ] Process payment
- [ ] View bookings

### Step 8: Build for Production ?? 30-60 minutes

```bash
# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production
```

### Step 9: Submit to App Stores ?? 1-2 hours

**iOS:**
```bash
eas submit --platform ios --profile production
```

**Android:**
```bash
eas submit --platform android --profile production
```

**Requirements:**
- Apple Developer account ($99/year)
- Google Play Developer account ($25 one-time)
- Privacy policy URL
- Terms of service URL
- App icons and screenshots

---

## ?? Documentation Reference

- **`SETUP_PRODUCTION.md`** - Detailed setup instructions
- **`PRODUCTION_READINESS.md`** - Complete production checklist
- **`.env.example`** - All environment variables explained

---

## ?? Quick Commands Reference

```bash
# Setup
npm run setup                    # Create .env file
npm run validate-env             # Validate configuration

# Development
npm start                         # Start Expo dev server
npm run ios                       # Run on iOS
npm run android                   # Run on Android

# Building
eas build --platform ios          # Build iOS
eas build --platform android      # Build Android
eas build --platform all          # Build both

# Submission
eas submit --platform ios        # Submit to App Store
eas submit --platform android     # Submit to Play Store
```

---

## ?? Important Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use test keys for development** - Only use production keys when ready
3. **Test thoroughly** - Test all flows before launching
4. **Set up monitoring** - Consider adding Sentry for error tracking
5. **Backup your credentials** - Store Supabase and Stripe keys securely

---

## ?? Troubleshooting

### Environment variables not loading?
- Make sure they start with `EXPO_PUBLIC_`
- Restart Expo dev server: `expo start -c`
- Check `.env` file exists and has correct values

### Configuration errors?
- Run `npm run validate-env` to see what's missing
- Check `PRODUCTION_READINESS.md` for details

### Build failures?
- Check `eas.json` configuration
- Verify all dependencies installed: `npm install`
- Check EAS build logs in Expo dashboard

---

## ? Final Checklist Before Launch

- [ ] All environment variables set in `.env`
- [ ] Supabase database configured and tested
- [ ] Stripe account set up and tested
- [ ] Backend API deployed and tested
- [ ] EAS project initialized
- [ ] Configuration validated (`npm run validate-env`)
- [ ] Tested on real iOS device
- [ ] Tested on real Android device
- [ ] All critical flows tested
- [ ] Privacy policy created and hosted
- [ ] Terms of service created and hosted
- [ ] App icons prepared
- [ ] Screenshots prepared
- [ ] Error tracking configured (optional but recommended)

---

**Estimated Total Time:** 4-12 hours (depending on backend setup)

**You're almost there!** Complete the steps above and you'll be ready to launch! ??
