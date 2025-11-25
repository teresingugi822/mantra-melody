# Mantra Music - React Native Mobile App

This is the React Native version of Mantra Music built with Expo, designed for iOS and Android deployment.

## Quick Start

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Run on Your Phone
Download the **Expo Go** app from your phone's app store, then:

```bash
npm start
# Scan the QR code with Expo Go
```

### 3. Build for App Stores

#### iOS (requires Mac)
```bash
eas build --platform ios
eas submit --platform ios
```

#### Android
```bash
eas build --platform android
eas submit --platform android
```

## Project Structure

```
mobile/
├── app.json              # Expo configuration
├── eas.json              # EAS build settings
├── app.native.tsx        # Root component
├── src/
│   ├── screens/          # App screens (Landing, Home, Create, Library)
│   ├── components/       # Reusable components
│   ├── api/              # API client
│   ├── context/          # Auth context
│   └── lib/              # Utilities
└── assets/               # App icons and splash screen
```

## Key Features

- **Cross-Platform**: Single codebase for iOS and Android
- **Authentication**: Secure login via backend API
- **Mantra Creation**: Write mantras and select genres
- **AI Song Generation**: Backend generates unique songs
- **Music Playback**: Stream generated songs
- **Downloads**: Save songs to device

## Configuration

### Backend URL
Update in `src/api/client.ts`:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
```

### App Metadata
Edit `app.json` to customize:
- App name and slug
- Bundle identifiers
- Version numbers
- Icons and splash screen

## Deployment Checklist

- [ ] Set API_URL environment variable
- [ ] Create Apple Developer account ($99/year)
- [ ] Create Google Play Developer account ($25)
- [ ] Generate app icons and splash screen
- [ ] Write app description and screenshots
- [ ] Configure provisioning profiles for iOS
- [ ] Set up signing credentials in EAS

## Troubleshooting

**App crashes on startup:**
- Check that backend API is running and accessible
- Verify network connectivity
- Check Console for error messages

**Build fails:**
- Clear cache: `eas build --platform ios --clear-cache`
- Update dependencies: `npm install`
- Check credentials: `eas credentials`

**QR code won't scan:**
- Ensure good lighting
- Try different angle
- Restart Expo Go app

## Documentation

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [EAS Build Guide](https://docs.eas.build)
- [Replit Expo Tutorial](https://docs.replit.com/tutorials/expo-on-replit)

## Support

For issues specific to Replit, refer to the [Replit Expo documentation](https://docs.replit.com/tutorials/expo-on-replit).
