# Mantra Music Design Guidelines

## Design Approach

**Reference-Based Approach** blending music streaming energy with wellness serenity:
- **Spotify**: Dynamic playlists, vibrant gradients, energetic UI, album art focus
- **Calm/Headspace**: Soothing transitions, mindful spacing, uplifting imagery
- **SoundCloud**: Waveform visualizations, audio-first design, creative community feel

**Core Principle:** Create a rhythmic, emotionally charged experience that feels like music in motion—vibrant, empowering, and transformative.

---

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - Clean, modern sans-serif for UI and body text
- Accent: Playfair Display (Google Fonts) - Elegant serif for mantras, lyrics, and inspirational moments

**Hierarchy:**
- Hero Headlines: 4xl to 6xl (Playfair Display, font-bold, italic for emphasis)
- Section Titles: 2xl to 4xl (Inter, font-bold)
- Mantra/Lyric Text: xl to 3xl (Playfair Display, font-semibold, italic)
- Body/UI: base to lg (Inter, font-normal)
- Metadata: sm to base (Inter, font-medium)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24

**Vertical Rhythm:**
- Section padding: py-16 (mobile), py-24 to py-32 (desktop)
- Component spacing: space-y-8 to space-y-16
- Card padding: p-6 to p-10

**Container Strategy:**
- Hero sections: Full-width with max-w-7xl inner content
- App workspace: max-w-6xl centered
- Mantra composer: max-w-4xl (focused writing zone)
- Grid layouts: gap-6 to gap-8

---

## Component Library

### Navigation
Sticky header with glass-morphism backdrop-blur effect, gradient border-bottom. Logo with musical note accent, primary CTA "Start Creating", navigation links (How It Works, Explore Genres, My Library, Sign In). Include subtle waveform pattern in background.

### Hero Section
**Full-width (80-90vh) hero with layered visual depth:**
- Large hero image: Person with headphones in golden hour light, eyes closed in peaceful moment, or vibrant concert/festival crowd with raised hands
- Animated waveform overlay pulsing subtly across the image
- Gradient overlay creating depth (genre-inspired: purple-to-blue or orange-to-pink)
- Headline: "Transform Your Words into Music That Moves You" (Playfair Display, large, centered)
- Subheadline: "AI-powered songs from your mantras. Choose your vibe. Feel the rhythm of change."
- Primary CTA: Large button with blurred background, musical note icon
- Trust indicator: "10,000+ songs created • 6 musical genres • Instant generation"
- Floating vinyl record graphic in corner with subtle rotation animation

### Mantra Composer Interface
Large, centered workspace with musical ambiance:
- Generous textarea (min-h-64) with animated waveform border that pulses on focus
- Floating label: "Write your mantra, goal, or daily affirmation..."
- Character counter with musical notation (e.g., "♪ 150 characters")
- Genre selector grid (3x2 on desktop, 2x3 on mobile) with visual identity:
  - **Soul**: Purple gradient card, vinyl icon
  - **Blues**: Indigo gradient, saxophone silhouette
  - **Hip-Hop**: Orange-red gradient, turntable icon
  - **Reggae**: Green-yellow gradient, palm tree icon
  - **Pop**: Bright pink-blue gradient, microphone icon
  - **Acoustic**: Warm brown-amber gradient, guitar icon
- Each genre card shows animated waveform pattern on hover
- Generate button: Prominent, pulsing subtle glow effect, "Create My Song" text

### Audio Player Component
Premium music player card with rich visual feedback:
- Rounded-xl card with genre-specific gradient background
- Large square album art area with animated waveform visualization
- Track title in Playfair Display (user's mantra theme)
- Genre badge with icon
- Professional controls: Skip back, Play/Pause (large, glowing when active), Skip forward, Loop toggle, Download, Share
- Progress bar with time stamps, waveform preview along the bar
- Volume slider with icon
- Lyrics display toggle showing scrolling mantra text

### Genre Showcase Section
**6 genre cards in 2-column grid (mobile) to 3-column (desktop):**
Each card features:
- Genre-specific gradient background with pattern overlay
- Large genre icon (vinyl, guitar, microphone, etc.)
- Genre name (text-2xl, font-bold)
- Mood tags ("Soulful • Uplifting • Smooth")
- Sample waveform visualization
- "Explore" button with blurred background
- Hover effect: Card lifts, waveform animates

### Playlist Discovery Section
**Three time-of-day playlists with rich imagery:**

**Morning Motivation:**
- Image: Sunrise over mountains, person doing yoga silhouette, golden hour glow
- Gradient overlay: Orange to pink
- Playlist name + track count ("15 mantras")
- Large play button with blurred background, centered
- Featured track previews (3 small waveforms)

**Daytime Energy:**
- Image: Urban scene, active person, vibrant street art, or workout moment
- Gradient overlay: Yellow to red
- Same structure as Morning

**Bedtime Calm:**
- Image: Peaceful night sky, stars, moonlight on water, or meditation space
- Gradient overlay: Deep blue to purple
- Same structure as Morning

### My Library View
Grid layout showing user's created songs:
- 2 columns (mobile), 3-4 columns (desktop)
- Each card displays:
  - Animated waveform thumbnail (genre-colored)
  - Mantra preview (first 40 characters in Playfair italic)
  - Genre badge and timestamp
  - Quick play button overlay
  - Edit/delete icons on hover
- Filter bar: Sort by genre, date, favorites
- Search input with musical note icon

### Feature Explanation Section
**3-column grid (stacks mobile):**
1. **Write Your Mantra** - Icon: Pen with musical staff, description of distraction-free writing
2. **Choose Your Vibe** - Icon: Genre selector visualization, description of 6 musical styles
3. **Listen & Transform** - Icon: Headphones with soundwave, description of instant playback

### Social Proof Section
**2-column testimonial grid (single column mobile):**
- User quotes in Playfair italic with oversized quotation marks
- User name, transformation timeframe ("2 weeks of daily mantras")
- Small waveform accent below each quote
- Subtle card hover lift effect

### Footer
Multi-column layout with:
- Newsletter signup: "Get weekly mantra inspiration" with email input
- Quick links (navigation, support, privacy)
- Social icons with musical note motifs
- Genre tags as quick links
- Trust badges: "AI-Powered • Instant Generation • Unlimited Songs"

---

## Images

**Hero Section:** Full-width, high-impact image (80-90vh)
- Person with headphones in meditative moment during golden hour
- Or: Peaceful concert crowd with raised hands, warm lighting
- Treatment: Genre-gradient overlay (purple-blue or orange-pink), subtle waveform animation layer

**Playlist Cards:** Medium rectangular images with gradient overlays
- Morning: Sunrise yoga, golden hour meditation, mountain peaks
- Daytime: Urban energy, workout scenes, vibrant street moments
- Bedtime: Night sky, starfield, moonlit water, peaceful bedroom

**Genre Cards:** Abstract gradient backgrounds with icon overlays (no photos needed)

**Icons:** Heroicons via CDN - musical-note, microphone, headphones, sparkles, heart, bookmark, plus custom music icons (vinyl, guitar, waveform)

---

## Musical Visual Motifs

Integrate throughout the design:
- **Waveform patterns:** As borders, backgrounds, and loading states
- **Vinyl records:** Rotating accent graphics, genre identifiers
- **Music notes:** Floating decorative elements, bullet points, icons
- **Rhythm patterns:** Dotted patterns suggesting beats/bars
- **Audio bars:** Equalizer-style visualizations in headers and cards

---

## Animations

**Strategic, music-inspired motion:**
- Waveform pulse on audio playback
- Vinyl record subtle rotation
- Genre card waveform animation on hover
- Button scale-105 on hover
- Card gentle lift with shadow increase
- Progress bar smooth fill
- Page sections fade-in on scroll with rhythm (staggered timing)

---

## Accessibility

- 44px minimum touch targets
- Visible form labels
- Keyboard-navigable audio controls with custom focus states
- ARIA labels on all icon buttons
- 4.5:1 color contrast minimum
- Waveform patterns remain decorative, not essential information

---

## Mobile Considerations

- Sticky audio player at bottom during playback
- Genre selector: 2-column grid on mobile
- Hamburger menu with slide-in drawer
- Full-width mantra composer
- Single-column playlist and library cards
- Touch-optimized controls (larger tap areas)