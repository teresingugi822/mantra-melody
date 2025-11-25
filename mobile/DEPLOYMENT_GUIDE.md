# Mantra Music Mobile App - Complete Deployment Guide

## Table of Contents
1. [Pre-Deployment Setup](#pre-deployment-setup)
2. [iOS Deployment](#ios-deployment)
3. [Android Deployment](#android-deployment)
4. [Post-Launch Maintenance](#post-launch-maintenance)

---

## Pre-Deployment Setup

### 1. Set Up Expo Account
```bash
npm install -g eas-cli
eas login
# Log in with your Expo account (create at https://expo.dev if needed)
```

### 2. Configure API Endpoint
Update `eas.json` with your production backend URL:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-mantra-music-api.replit.dev/api"
      }
    }
  }
}
```

### 3. Update App Version
Edit `app.json`:
```json
{
  "version": "1.0.0",
  "ios": {
    "buildNumber": "1"
  },
  "android": {
    "versionCode": 1
  }
}
```

### 4. Create App Icons & Splash Screen
Place images in `mobile/assets/`:
- `icon.png` - 1024x1024px (app icon)
- `splash.png` - 1242x2436px (splash screen)
- `adaptive-icon.png` - 1024x1024px (Android only)

---

## iOS Deployment

### Prerequisites
- Mac with Xcode installed
- Apple Developer account ($99/year)
- Apple ID with developer permissions

### Step 1: Create App Store Connect Entry
1. Visit [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with your Apple ID
3. Click "+" > "New App"
4. Select "iOS, iPadOS, tvOS, watchOS"
5. Fill in:
   - **Platform**: iOS
   - **App Name**: Mantra Music
   - **Primary Language**: English
   - **Bundle ID**: com.mantramusic.app
   - **SKU**: mantra-music-001
   - **User Access**: Full Access

### Step 2: Configure Signing Credentials
```bash
cd mobile
eas credentials
# Select iOS
# Choose "Create App Store Connect API Key"
# Follow prompts to set up credentials
```

### Step 3: Build for iOS
```bash
eas build --platform ios --profile production
# This creates an .ipa file
# Processing typically takes 10-15 minutes
```

### Step 4: Submit to App Store
```bash
eas submit --platform ios
# Or upload manually via Xcode
```

### Step 5: App Review Process
1. App Store will review within 24 hours
2. May request changes (app privacy policy, screenshots, description)
3. Once approved, app appears on App Store

### iOS App Store Requirements
- ✅ Privacy Policy (required)
- ✅ App Screenshots (5 per device type)
- ✅ App Description (4000 chars max)
- ✅ Keywords (100 chars max)
- ✅ Support URL
- ✅ Category: Music
- ✅ Content Rating: None (low content rating)

---

## Android Deployment

### Prerequisites
- Google Play Developer account ($25 one-time)
- Android signing key

### Step 1: Create Google Play Console Entry
1. Visit [Google Play Console](https://play.google.com/console)
2. Sign in with Google account
3. Create new project "Mantra Music"
4. Fill in app details:
   - **App name**: Mantra Music
   - **Default language**: English
   - **App category**: Music & Audio
   - **Content rating**: All ages

### Step 2: Configure Signing Credentials
```bash
cd mobile
eas credentials
# Select Android
# Choose "Create Android Keystore"
# Save credentials securely!
```

### Step 3: Build for Android
```bash
eas build --platform android --profile production
# Creates an AAB (Android App Bundle)
# Processing typically takes 15-20 minutes
```

### Step 4: Create Release in Play Console
1. Go to Google Play Console > Mantra Music
2. Navigate to Release > Production
3. Click "Create new release"
4. Upload the AAB file from build

### Step 5: Fill App Details
In Google Play Console:
- **App Title**: Mantra Music
- **Short Description**: (80 chars max)
  "Transform mantras into AI-generated songs. Soul, Blues, Hip-Hop & more."
- **Full Description** (4000 chars):
  ```
  Mantra Music transforms your personal mantras, affirmations, and goals 
  into beautiful AI-generated songs with custom lyrics and music.
  
  Features:
  • Write your own mantras and affirmations
  • Choose from 6 music genres (Soul, Blues, Hip-Hop, Reggae, Pop, Acoustic)
  • AI-powered lyrics generation preserving your intention
  • Unique songs with professional vocals and instrumentals
  • Create custom playlists for different times of day
  • Full audio and video downloads for offline listening
  • Karaoke-style lyrics display while playing
  • Multiple loop modes for continuous playback
  • Share your songs with friends
  
  Perfect for meditation, motivation, wellness, and personal growth.
  ```

### Step 6: Upload Screenshots & Graphics
Required:
- 5 Phone screenshots (1440x2560px each)
- 1 Feature graphic (1024x500px)
- 1 App icon (512x512px)

Sample screenshot ideas:
1. Landing page with app tagline
2. Mantra creation screen
3. Genre selection
4. Generated song playing
5. Library with multiple songs

### Step 7: Submit for Review
1. Review all information
2. Click "Send for review"
3. Google typically reviews within 24-48 hours
4. App appears immediately after approval

### Android Play Store Requirements
- ✅ Privacy Policy (required)
- ✅ Content Rating Questionnaire
- ✅ App Screenshots (5 minimum)
- ✅ Feature Graphic
- ✅ App Icon
- ✅ Category: Music & Audio
- ✅ Content rating: Low/None

---

## Post-Launch Maintenance

### Monitor App Performance
```bash
# View crash reports and analytics
# In Expo Dashboard: https://expo.dev/projects
```

### Update Apps
For version updates:

```bash
# 1. Update version in app.json
{
  "version": "1.1.0",
  "ios": { "buildNumber": "2" },
  "android": { "versionCode": 2 }
}

# 2. Rebuild for both platforms
eas build --platform ios --profile production
eas build --platform android --profile production

# 3. Submit updated builds
eas submit --platform ios
eas submit --platform android
```

### Manage User Reviews
- Respond to 1-star reviews professionally
- Address common issues
- Ask satisfied users for positive reviews

### Analytics & Crashes
Set up crash tracking in your backend or use Sentry:
```bash
npm install @sentry/react-native
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache
eas build --platform ios --clear-cache
eas build --platform android --clear-cache

# Check credentials
eas credentials

# Update dependencies
npm install
npm update
```

### App Crashes on Launch
- Check API endpoint is accessible
- Verify backend is running
- Check device internet connection
- Review console logs in Expo Dashboard

### App Rejected by Apple
Common reasons:
- Missing Privacy Policy (fix: add to app.json)
- Unclear what app does (fix: improve description & screenshots)
- Payment functionality issues (if applicable)
- Binary rejected (fix: rebuild)

### App Rejected by Google
Common reasons:
- Content rating mismatch
- App crashes on launch
- Intellectual property issues
- Misleading screenshots

---

## Cost Summary

| Item | Cost | Period |
|------|------|--------|
| Apple Developer Account | $99 | Annual |
| Google Play Developer Account | $25 | One-time |
| Backend Hosting (Replit) | $7-10/mo | Monthly |
| Domain Name | $10-15/year | Annual |
| **Total First Year** | ~$220 | - |
| **Yearly Ongoing** | ~$120 | - |

---

## Marketing & Growth

### Pre-Launch
- Create landing page
- Set up social media accounts
- Prepare press release

### Launch Day
- Post on social media
- Ask beta testers for reviews
- Send press releases to tech blogs

### Post-Launch
- Gather user feedback
- Implement feature requests
- Regular social media updates
- Consider paid ads (Google Ads, Apple Search Ads)

---

## Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **EAS Build Guide**: https://docs.eas.build
- **App Store Connect Help**: https://developer.apple.com/app-store-connect
- **Google Play Console Help**: https://support.google.com/googleplay

---

## Quick Checklist

### Before Submitting
- [ ] API endpoint configured correctly
- [ ] App tested on real device via Expo Go
- [ ] Privacy policy created and linked
- [ ] Screenshots prepared (1440x2560 for Android, 1242x2688 for iOS)
- [ ] App description written
- [ ] Version bumped in app.json
- [ ] Icons and splash screen ready

### iOS Submission
- [ ] Apple Developer Account active
- [ ] App Store Connect entry created
- [ ] Signing credentials configured
- [ ] Build created with eas build
- [ ] Screenshots uploaded
- [ ] Submitted for review

### Android Submission
- [ ] Google Play Developer Account active
- [ ] Google Play Console project created
- [ ] Signing key generated and backed up
- [ ] Build created with eas build
- [ ] Screenshots and graphics uploaded
- [ ] Content rating completed
- [ ] Submitted for review

---

**Estimated Timeline**: 2-3 weeks from start to both apps live on stores
