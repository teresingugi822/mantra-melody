# Mantra Music

## Overview

Mantra Music is a web application that transforms personal mantras, affirmations, and goals into personalized songs. Users write their mantras, select a music genre (soul, blues, hip-hop, reggae, pop, or acoustic), and the application generates custom songs with AI-powered lyrics and music. The app organizes songs into curated playlists (Morning Motivation, Daytime Energy, Bedtime Calm) or allows users to build their own library.

**Core Purpose**: Create an emotionally uplifting, transformation-focused experience that empowers users through personalized music generated from their own words.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The design follows a "new-york" style variant with custom theming based on HSL color variables for light/dark mode support.

**Routing**: Client-side routing using Wouter (lightweight React Router alternative) with routes for:
- Home page (`/`)
- Create/compose page (`/create`)
- Library view (`/library`)
- Playlist views (`/playlists/:type`)

**State Management**: TanStack Query (React Query) for server state management, API requests, and caching. No global state management library - component state and React Query handle all data flow.

**Design System**: Custom design guidelines inspired by wellness apps (Calm/Headspace) and music platforms (Spotify), emphasizing:
- Soothing gradients and uplifting imagery
- Typography: Inter (UI/body) and Playfair Display (mantras/headings) from Google Fonts
- Spacing based on Tailwind's standardized units (2, 4, 6, 8, 12, 16, 20, 24)
- Glass-morphism effects with backdrop-blur
- Responsive layouts with mobile-first approach

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API with JSON responses:
- `GET /api/songs` - Retrieve all songs
- `GET /api/playlists/:type/songs` - Get songs by playlist type
- `POST /api/songs/generate` - Generate new song from mantra

**Request Handling**: Custom middleware for logging, JSON parsing with raw body capture for webhooks, and request timing.

**Development Setup**: Vite middleware integration for HMR (Hot Module Replacement) in development, with separate build output for production.

### Data Layer

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Database Schema**:
- `mantras` table - Stores user-written text with UUID primary keys
- `songs` table - Generated songs linked to mantras, includes title, genre, lyrics, audio URL, status (pending/generating/completed/error), optional playlist type, voice characteristics (vocalGender, vocalStyle), and useExactLyrics flag
- `playlists` table - Curated and custom playlists with name, type, and description

**Migration Strategy**: Drizzle Kit for schema migrations stored in `/migrations` directory.

**Type Safety**: Zod schemas generated from Drizzle schema for runtime validation, ensuring type consistency between database, API, and frontend.

### AI Integration

**Lyrics Generation**: OpenAI GPT-4o integration via Replit's AI Integrations service (proxy that eliminates need for personal API keys). The system transforms user mantras into song lyrics while preserving the core message and emotional intent. Enhanced error handling validates non-empty responses and provides detailed error messages.

**Music Generation**: SunoAPI.org integration for text-to-music synthesis with voice customization. Users select vocal gender (male/female) and style (warm, powerful, soft, energetic, soulful, gritty). Production-ready error handling with 180-second polling timeout.

**Critical Configuration**: Suno API in custom mode requires specific field mapping:
- `prompt`: Contains the actual **lyrics text to be sung** (3000-5000 char limit)
- `style`: Contains the **genre/style description** (e.g., "soul, warm")
- `customMode: true` + `instrumental: false` + `vocalGender` ensures vocals sing the lyrics

**Workflow**:
1. User submits mantra text, genre selection, and voice characteristics
2. Backend creates mantra record in database
3. OpenAI generates song title using `gpt-4o` model
4. OpenAI generates lyrics based on mantra (exact or transformed) with verse/chorus structure
5. Song record created with title, lyrics, and "generating" status
6. Suno API generates audio with lyrics in `prompt` field and genre in `style` field
7. Backend polls Suno API every 3 seconds (max 180 seconds) for completion
8. On success: Song record updated with audio URL and "completed" status
9. On failure: Song record updated to "error" status with HTTP 500 response

### Authentication & Sessions

Currently no authentication system implemented - the application operates as a single-user experience. Session management infrastructure (connect-pg-simple) is available in dependencies but not actively used.

## External Dependencies

### Third-Party APIs

**Replit AI Integrations (OpenAI Proxy)**:
- Environment: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`
- Model: `gpt-4o` (latest OpenAI chat completion model as of 2025)
- Purpose: Generate song titles and transform mantras into structured lyrics
- Managed service eliminates need for personal OpenAI API keys
- Error handling: Validates non-empty responses, provides fallback for titles

**SunoAPI.org Music Generation**:
- Environment: `SUNO_API_KEY`
- Purpose: Text-to-music synthesis with vocal generation
- Base URL: `https://api.sunoapi.org`
- Generate endpoint: `/api/v1/generate` (POST)
  - `prompt`: Lyrics text to sing (required in custom mode)
  - `style`: Genre/style description (required)
  - `title`: Song title (required)
  - `customMode: true` (enables manual lyric control)
  - `instrumental: false` (enables vocals)
  - `vocalGender`: "m" or "f" (optional)
  - `model`: "V4" (Suno's AI model version)
  - `callBackUrl`: Webhook for generation updates
- Polling endpoint: `/api/v1/generate/record-info?taskId=...` (GET)
- Polling strategy: 3-second intervals, 60 attempts max (180 seconds total)
- Error handling: Exception-based with HTTP 500 responses for failures

### Database

**PostgreSQL via Neon**:
- Environment: `DATABASE_URL`
- Connection: Neon Serverless driver with WebSocket support
- Schema managed through Drizzle ORM
- Connection pooling via @neondatabase/serverless

### UI Component Libraries

**Radix UI**: Unstyled, accessible component primitives for building the design system (accordion, dialog, dropdown, slider, toast, etc.)

**Embla Carousel**: Touch-friendly carousel component for potential playlist/song browsing features

### Development Tools

**Vite Plugins**:
- Runtime error modal overlay
- Replit-specific dev tools (cartographer for code navigation, dev banner)

### Asset Management

Images stored in `/attached_assets/generated_images/` for hero sections and playlist covers (morning, daytime, bedtime themes).