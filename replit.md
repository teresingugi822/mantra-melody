# Mantra Music

## Overview

Mantra Music is a web application designed to transform users' personal mantras, affirmations, and goals into personalized songs. Users can input their mantras, select a music genre (soul, blues, hip-hop, reggae, pop, or acoustic), and the application, leveraging AI, generates custom songs with unique lyrics and music. The app facilitates organization of these songs into curated playlists (Morning Motivation, Daytime Energy, Bedtime Calm) or allows users to create their own song libraries. The core purpose is to provide an emotionally uplifting and transformative experience through personalized, AI-generated music based on user-defined intentions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18+ and TypeScript, utilizing Vite for development and bundling. Shadcn/ui, based on Radix UI primitives and styled with Tailwind CSS, forms the UI component system, featuring a "new-york" style variant with custom HSL-based theming for light/dark modes. Routing is handled by Wouter, supporting authenticated and unauthenticated user flows for different pages (Landing, Home, Create, Library, Playlists). Authentication state is managed via a `useAuth()` hook. Server state and API interactions are managed with TanStack Query, avoiding a global state management library. The music playback system, managed by an `AudioPlayer` component, supports three loop modes (off, song, library) and continuous playback, with state synchronization to the Library page. The design system emphasizes soothing gradients, uplifting imagery, Inter and Playfair Display typography, Tailwind-based spacing, glass-morphism effects, and a mobile-first responsive layout.

### Backend

The backend is an Express.js application built with Node.js and TypeScript, providing a RESTful API with JSON responses. Key endpoints include fetching songs and playlists, and generating new songs. It incorporates custom middleware for logging and JSON parsing.

### Data Layer

Drizzle ORM provides type-safe database queries and schema management for a PostgreSQL database. The schema includes `users`, `sessions`, `mantras`, `songs`, and `playlists` tables, with relationships defining user ownership of mantras and songs. Drizzle Kit manages schema migrations. Zod schemas generated from Drizzle ensure type consistency across the application stack.

### AI Integration

AI integration is central to song generation:
- **Lyrics Generation**: OpenAI GPT-4o, accessed via Replit's AI Integrations service, generates song titles and transforms user mantras into structured lyrics, preserving emotional intent.
- **Music Generation**: SunoAPI.org is used for text-to-music synthesis, offering vocal customization (gender, style). It requires specific field mapping for custom mode, including lyrics in the `prompt` and genre in the `style` field. The workflow involves the backend creating mantra records, generating titles and lyrics with OpenAI, creating song records, generating audio with Suno, and polling Suno for completion updates.

### Authentication & Sessions

The application uses multi-user username/password authentication. Passport.js with a local strategy and bcryptjs for password hashing secures user accounts. Sessions are PostgreSQL-backed using `connect-pg-simple`, with secure cookie settings. All API endpoints are protected by `isAuthenticated` middleware, ensuring data isolation and security by enforcing user scoping for all CRUD operations, returning 404s for unauthorized access attempts.

## External Dependencies

### Third-Party APIs

- **Replit AI Integrations (OpenAI Proxy)**: Used for `gpt-4o` model to generate song titles and lyrics.
- **SunoAPI.org**: Used for text-to-music synthesis, providing vocal generation with customizable gender and style.

### Database

- **PostgreSQL via Neon**: Serverless driver used for database connection and management.

### UI Component Libraries

- **Radix UI**: Provides unstyled, accessible component primitives.
- **Embla Carousel**: Used for touch-friendly carousel functionality.

### Development Tools

- **Vite Plugins**: For development workflow enhancements.

### Asset Management

- **`/attached_assets/generated_images/`**: Stores hero section and playlist cover images.