# Mantra Music Mobile App Setup Guide

## Overview
This document outlines how to build and deploy Mantra Music as native iOS and Android apps using Expo React Native.

## Architecture
- **Original Web App**: Located in `client/` and `server/` directories (unchanged)
- **Mobile App**: Located in `mobile/` directory (new React Native app)
- **Backend**: Shared between web and mobile apps - both call the same Express API

## Key Differences: Web vs Mobile
| Feature | Web App | Mobile App |
|---------|---------|-----------|
| Framework | React (Web) | React Native (Expo) |
| Navigation | Wouter | React Navigation |
| UI Components | shadcn/ui + Radix | React Native + Expo UI Kit |
| Styling | Tailwind CSS | React Native StyleSheet |
| File System | N/A | Expo FileSystem |
| Audio | HTML5 Audio | Expo AV |
| Storage | Browser Storage | AsyncStorage |

## Mobile App Structure
```
mobile/
├── app.json              # Expo configuration
├── app.native.tsx        # React Native entry point
├── package.json          # Mobile app dependencies
├── src/
│   ├── screens/         # Mobile screens
│   │   ├── landing.tsx
│   │   ├── home.tsx
│   │   ├── create.tsx
│   │   └── library.tsx
│   ├── components/      # Shared React Native components
│   │   ├── audio-player.native.tsx
│   │   └── genre-selector.native.tsx
│   ├── api/             # API client
│   │   └── client.ts
│   └── lib/
│       └── storage.ts   # AsyncStorage wrapper
└── assets/              # Mobile-specific assets
```

## Prerequisites
1. **Expo CLI**: `npm install -g expo-cli`
2. **EAS CLI** (for building): `npm install -g eas-cli`
3. **Expo Go App**: Download from App Store or Google Play (for testing)
4. **Apple Developer Account**: Required for iOS ($99/year)
5. **Google Play Developer Account**: Required for Android ($25 one-time)

## Setup Instructions

### 1. Initialize Mobile App
```bash
cd mobile
npm install
```

### 2. Test on Your Phone
```bash
npx expo start
# Scan QR code with Expo Go app on your phone
```

### 3. Build for iOS
```bash
# First time setup
eas login
eas build --platform ios

# Then submit to App Store
eas submit --platform ios
```

### 4. Build for Android
```bash
eas login
eas build --platform android

# Upload AAB to Google Play Console manually
# Or use: eas submit --platform android
```

## Deployment Steps

### iOS App Store
1. Create Apple Developer account ($99/year)
2. Set up App Store Connect credentials in Replit secrets
3. Configure provisioning profiles
4. Build: `eas build --platform ios --auto-submit`
5. App review (typically 24 hours)

### Google Play Store
1. Create Google Play Developer account ($25)
2. Set up service account credentials
3. Build: `eas build --platform android --auto-submit`
4. Publish to internal testing first, then alpha/beta

## File Storage & Download Handling
- Uses Expo `DocumentPicker` for file access
- Uses Expo `MediaLibrary` for saving downloads to device
- Audio files saved to app's document directory
- Videos saved to device photo library (if granted permission)

## Authentication
- Sessions managed via secure HTTP cookies (same as web app)
- User state synced from backend API
- AsyncStorage used for offline token caching

## API Configuration
Update `src/api/client.ts` with your backend URL:
```typescript
const API_BASE_URL = 'https://your-app.replit.dev/api';
```

## Troubleshooting

### Build Fails
- Clear cache: `eas build --platform ios --clear-cache`
- Check credentials: `eas credentials`
- Update dependencies: `npm install`

### App Crashes on Startup
- Check console: `npx expo start --dev-client`
- Verify API endpoint is accessible
- Check AsyncStorage permissions

### QR Code Scanner Not Working
- Grant camera permissions in app
- Try different lighting conditions
- Use `expo-qr-code` library

## Publishing Checklist
- [ ] Update version in `app.json`
- [ ] Test on iOS device via TestFlight
- [ ] Test on Android device via Google Play beta
- [ ] Create app privacy policy
- [ ] Prepare app store screenshots
- [ ] Write compelling app description
- [ ] Set app pricing ($0 for free tier)
- [ ] Submit iOS build for review
- [ ] Publish Android to Play Store

## Continuous Deployment
Update `eas.json` for CI/CD integration:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "production": {
      "env": {
        "API_URL": "https://your-app.replit.dev/api"
      }
    }
  }
}
```

## Helpful Resources
- [Expo Documentation](https://docs.expo.dev)
- [Replit Expo Tutorial](https://docs.replit.com/tutorials/expo-on-replit)
- [EAS Build Documentation](https://docs.eas.build)
- [React Native Docs](https://reactnative.dev)

## Support
For issues with Replit-specific setup, check: https://docs.replit.com/tutorials/expo-on-replit
