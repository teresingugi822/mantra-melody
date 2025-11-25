# Backup & Clone Setup - Mantra Music

## Current Project Structure

Your Mantra Music project now has TWO versions:

### Original Web App (Unchanged)
Located in root directories:
- `client/` - React web frontend
- `server/` - Express backend
- `shared/` - Shared types and schemas
- Run with: `npm run dev`

### New Mobile App (React Native)
Located in:
- `mobile/` - Complete Expo React Native app
- Shares the same backend with web app
- Can run independently or alongside web app

---

## Directory Structure

```
/
├── client/                    # Web app (ORIGINAL - DO NOT MODIFY)
├── server/                    # Backend API (shared)
├── shared/                    # Shared schemas (shared)
├── mobile/                    # NEW React Native app
│   ├── app.json               # Expo configuration
│   ├── eas.json               # iOS/Android build config
│   ├── app.native.tsx         # Mobile entry point
│   ├── src/
│   │   ├── screens/           # Mobile screens
│   │   ├── components/        # Mobile components
│   │   ├── api/               # API client
│   │   ├── context/           # Auth context
│   │   └── lib/               # Utilities
│   └── assets/                # Icons, splash screen
├── MOBILE_APP_SETUP.md        # Mobile setup guide
├── DEPLOYMENT_GUIDE.md        # iOS/Android deployment
└── package.json               # Root project
```

---

## How to Use

### Option 1: Keep Both Web & Mobile Running Together

**Web App:**
```bash
npm run dev
# Serves on http://localhost:5000
```

**Mobile App (in separate terminal):**
```bash
cd mobile
npm install
npm start
# Scan QR code with Expo Go app
```

### Option 2: Use Only Mobile

The mobile app is fully functional and can work as the primary app.

### Option 3: Backup & Archive Original

If you want to save the original web app for historical purposes:

```bash
# Create a git branch for the original
git checkout -b backup/original-web-app

# Or create a compressed archive
tar -czf mantra-music-web-backup.tar.gz client/ server/ shared/

# Store safely
```

---

## Backend Sharing

Both web and mobile apps use the **same backend**:

**Web App API Calls:**
```javascript
fetch('/api/songs')  // Local path works during dev
```

**Mobile App API Calls:**
```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
fetch(API_URL + '/songs')
```

### For Production

Update the mobile app's backend URL in `mobile/eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-production-api.replit.dev/api"
      }
    }
  }
}
```

---

## What's Different Between Web & Mobile

| Feature | Web App | Mobile App |
|---------|---------|-----------|
| Framework | React 18 | React Native |
| UI Kit | shadcn/ui | React Native + Expo |
| Styling | Tailwind CSS | React Native StyleSheet |
| Navigation | Wouter | React Navigation |
| Audio | HTML5 Audio | Expo AV |
| File Handling | Browser APIs | Expo File System |
| Authentication | HTTP Cookies | HTTP Cookies + SecureStore |

---

## Workflow: From Web to Mobile

### Step 1: Original Web App Works
- Users login to web version
- Create mantras and songs
- Play and manage library
- Everything works as before

### Step 2: Mobile App Goes Live
- Same features available on phone
- Same backend (songs sync instantly)
- Independent app stores

### Step 3: Future Updates
- Update `server/` for API changes (affects both)
- Update `client/` for web-specific features
- Update `mobile/` for mobile-specific features
- Rebuild and resubmit mobile apps to app stores

---

## Deployment Timeline

1. **Weeks 1-2**: Finalize mobile app features
2. **Week 3**: Build and submit to app stores
3. **Week 4**: App reviews (iOS: 1-2 days, Android: 1-2 days)
4. **Week 5**: Apps live in App Store & Play Store!

---

## Backup Strategy

### Recommended Backups

1. **Git Tags** (for version history)
```bash
git tag v1.0.0-web-original
git tag v1.0.0-mobile-initial
git push origin --tags
```

2. **Branches** (keep history)
```bash
git branch -b backup/web-v1.0
git branch -b backup/mobile-v1.0
```

3. **File Backup** (offline storage)
```bash
# Archive the entire project
zip -r mantra-music-backup.zip . -x "node_modules/*" ".git/*"
# Store on Google Drive, Dropbox, or external drive
```

---

## Important Notes

### ⚠️ Do NOT Modify These Files (Shared)
```
shared/schema.ts          # Used by web & mobile
server/                   # Used by web & mobile
package.json (root)       # Affects both apps
```

### ✅ Safe to Modify
```
client/                   # Web app only
mobile/                   # Mobile app only
```

### 🔄 Syncing Backend Changes
If you update the backend:
1. Test with web app first
2. Rebuild mobile: `eas build --platform ios && eas build --platform android`
3. Resubmit to app stores

---

## Support & Troubleshooting

### Web App Not Loading?
```bash
npm run dev
# Check http://localhost:5000
```

### Mobile App Won't Connect?
```bash
# Update API endpoint in mobile/eas.json
# Or test with local backend:
cd mobile
npm start
# Use Expo Go to test
```

### Git History?
All changes are tracked in git. Use:
```bash
git log --oneline
git show <commit>
git diff <branch1> <branch2>
```

---

## Next Steps

1. **Test Mobile App**: `cd mobile && npm start`
2. **Read Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
3. **Configure API Endpoint**: Update `mobile/eas.json`
4. **Create Apple & Google Accounts**: For app store submission
5. **Build & Deploy**: Follow the deployment guide

---

**Questions?** Check `MOBILE_APP_SETUP.md` for detailed setup instructions.
