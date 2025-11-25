# Mantra Music

## Overview

Mantra Music is a multi-platform web application that transforms users' personal mantras, affirmations, and goals into personalized songs. Users can input their mantras, select a music genre (soul, blues, hip-hop, reggae, pop, or acoustic), and the application, leveraging AI, generates custom songs with unique lyrics and music. The app facilitates organization of these songs into curated playlists (Morning Motivation, Daytime Energy, Bedtime Calm) or allows users to create their own song libraries. The core purpose is to provide an emotionally uplifting and transformative experience through personalized, AI-generated music based on user-defined intentions.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Major Updates

### Mobile App Development (November 2025)
Created complete Expo React Native mobile app for iOS and Android deployment:
- Full feature parity with web app (auth, mantra creation, song generation, library, playback)
- Shares backend with web app via same Express API
- Production-ready code with TypeScript and type safety
- Ready for App Store and Play Store submission
- See: `DEPLOYMENT_GUIDE.md` for complete deployment instructions

### Vibrant Musical Theme (November 2025)
Implemented comprehensive musical visual theme blending music streaming energy with wellness serenity:
- **Musical Visual Components**: Created reusable components (WaveformBars, VinylRecord, MusicNote, WaveformPattern, GenreIcon) for consistent musical aesthetic across the app
- **Genre-Specific Gradients**: Each genre features unique color palettes
- **Musical Decorations**: Animated waveforms, rotating vinyl records, floating music notes, and rhythm patterns throughout UI
- **Accessibility**: All animations respect `prefers-reduced-motion` for motion-sensitive users
- **Consistent Application**: Musical theme applied across Landing, Home, Create, Library pages, Genre Selector, and Audio Player

### Enhanced Lyrics Sync (November 2025)
Implemented advanced karaoke-style lyrics display with preview timing and 5-tier visual hierarchy:
- **2-Second Lead Time**: Lyrics appear 2 seconds before they're sung, giving users time to read ahead
- **5-Tier Visual Hierarchy**: Currently singing (3xl-5xl bold), next line (2xl-3xl), line after (xl-2xl), past lines (lg-xl), far future (base-lg)
- **Smooth Transitions**: 700ms duration with ease-out timing
- **Auto-Scroll**: Keeps highlighted line centered during playback
- **Responsive Design**: Text sizes scale across mobile/tablet/desktop breakpoints

### Mobile Optimization (November 2025)
Comprehensive mobile-friendly improvements ensuring production-ready experience:
- **Touch Targets**: All controls meet 44x44px minimum (WCAG 2.5.5 compliance)
- **Accessibility**: All icon-only buttons include aria-labels for screen readers
- **Responsive Layout**: Mobile-first design with proper stacking
- **Visual Optimizations**: Icon-only buttons on mobile to save space
- **Sticky Controls**: Audio player card stays at bottom with progress and volume always accessible

### Loop & Continuous Playback (November 2025)
Comprehensive playback controls with three loop modes and continuous library playback:
- **Loop Modes**: Off (stops after song), Song (repeat current track), Library (continuous playback with wrap-around)
- **Play All**: One-click button starts continuous playback through all ready songs
- **Smart Navigation**: Next/Previous buttons skip incomplete songs and wrap around in library mode
- **State Sync**: Loop mode changes propagate from AudioPlayer to Library page via callback

## System Architecture

### Frontend Architecture

**Web App**: React 18+ with TypeScript, using Vite for development and bundling. Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design follows a "new-york" style variant with custom theming based on HSL color variables for light/dark mode support.

**Mobile App**: React Native with Expo for cross-platform iOS and Android development. Full feature parity with web app but optimized for mobile interaction patterns and performance.

**Routing (Web)**: Client-side routing using Wouter with authentication-based routing:
- Landing page (`/`) - Unauthenticated users
- Home page (`/`) - Authenticated users
- Create/compose page (`/create`) - Authenticated only
- Library view (`/library`) - Authenticated only
- Playlist views (`/playlists/:type`) - Authenticated only

**Routing (Mobile)**: React Navigation with tab-based navigation for authenticated users and stack-based for auth flow.

**Authentication Hook**: `useAuth()` hook (web) / `AuthContext` (mobile) provides user state, loading status, and authentication status throughout the apps.

**State Management**: TanStack Query (React Query) for server state management, API requests, and caching. No global state management library.

**Music Playback System**:
- Web: HTML5 Audio element with custom controls
- Mobile: Expo AV for audio playback
- Both: Full playback controls (play/pause, volume, progress), loop modes (off/song/library), previous/next navigation
- Audio Player component manages playback state and provides controls to rest of application

### Backend

Express.js application built with Node.js and TypeScript, providing a RESTful API with JSON responses. Key endpoints include:
- Authentication: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/user`
- Mantras: `/api/mantras` (CRUD)
- Songs: `/api/songs` (generate, list, get, update, delete)
- Playlists: `/api/playlists` (CRUD)

### Data Layer

Drizzle ORM provides type-safe database queries and schema management for PostgreSQL. Schema includes `users`, `sessions`, `mantras`, `songs`, and `playlists` tables with proper relationships. Drizzle Kit manages schema migrations. Zod schemas generated from Drizzle ensure type consistency across the application stack.

### AI Integration

**Lyrics Generation**: OpenAI GPT-4o accessed via Replit's AI Integrations service generates song titles and transforms user mantras into structured lyrics, preserving emotional intent.

**Music Generation**: SunoAPI.org used for text-to-music synthesis with vocal customization (gender, style). Backend creates mantra records, generates titles/lyrics with OpenAI, creates song records, generates audio with Suno, and polls for completion updates.

### Authentication & Sessions

Multi-user username/password authentication using Passport.js with local strategy and bcryptjs for password hashing. Sessions are PostgreSQL-backed using `connect-pg-simple`, with secure cookie settings. All API endpoints protected by `isAuthenticated` middleware, ensuring data isolation and security.

## Project Structure

### Original Web App (Preserved)
```
client/              # React web frontend
server/              # Express backend
shared/              # Shared types and schemas
```

### New Mobile App (Expo React Native)
```
mobile/              # Complete React Native app
├── app.json         # Expo configuration
├── eas.json         # iOS/Android build settings
├── app.native.tsx   # Mobile entry point
└── src/
    ├── screens/     # Mobile screens (Landing, Home, Create, Library)
    ├── components/  # React Native components
    ├── api/         # API client
    ├── context/     # Auth context
    └── lib/         # Utilities
```

## External Dependencies

### Third-Party APIs
- **Replit AI Integrations (OpenAI Proxy)**: Used for `gpt-4o` model to generate song titles and lyrics
- **SunoAPI.org**: Used for text-to-music synthesis with customizable vocal generation

### Database
- **PostgreSQL via Neon**: Serverless driver for database connection and management

### UI Component Libraries (Web)
- **Radix UI**: Provides unstyled, accessible component primitives
- **Embla Carousel**: Used for touch-friendly carousel functionality

### Mobile Libraries
- **React Navigation**: Tab and stack navigation for mobile
- **Expo AV**: Audio/video playback for React Native
- **Expo Secure Store**: Secure credential storage on device
- **AsyncStorage**: Key-value storage for mobile app data

### Development Tools
- **Vite Plugins**: For web development workflow enhancements
- **Expo Build Service (EAS)**: For building iOS and Android apps in the cloud

### Asset Management
- `/attached_assets/generated_images/`: Stores hero section and playlist cover images

## Deployment

### Web App
Published via Replit's built-in deployment system to a `.replit.dev` domain.

### Mobile Apps
Published via EAS (Expo Application Services) to:
- **App Store (iOS)**: Apple's official iOS app store
- **Play Store (Android)**: Google's official Android app store

**Deployment Guide**: See `DEPLOYMENT_GUIDE.md` for complete step-by-step instructions including:
- Apple Developer account setup ($99/year)
- Google Play Developer account setup ($25 one-time)
- Building with EAS
- Submitting to app stores
- App review process
- Post-launch maintenance

## Documentation Files

- **MOBILE_APP_SETUP.md**: Architecture and setup overview for mobile app
- **DEPLOYMENT_GUIDE.md**: Complete step-by-step deployment guide for iOS and Android
- **BACKUP_AND_CLONE_INSTRUCTIONS.md**: Project structure and backup strategy
- **MOBILE_SETUP_COMPLETE.md**: Summary of what's been created
