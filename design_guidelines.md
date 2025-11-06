# Mantra Music Design Guidelines

## Design Approach

**Reference-Based Approach** drawing from wellness and music streaming leaders:
- **Calm/Headspace**: Soothing gradients, uplifting imagery, mindful spacing
- **Spotify**: Playlist management, audio controls, library organization
- **Notion**: Clean text input, distraction-free writing experience

Core principle: Create an emotionally uplifting, transformation-focused experience that makes users feel empowered and motivated.

---

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - Clean, modern sans-serif for UI and body text
- Accent: Playfair Display (Google Fonts) - Elegant serif for mantras, quotes, and inspirational headings

**Hierarchy:**
- Hero Headlines: 3xl to 5xl (Playfair Display, font-semibold)
- Section Titles: 2xl to 3xl (Inter, font-bold)
- Mantra Text: xl to 2xl (Playfair Display, font-medium, italic for emphasis)
- Body/UI: base to lg (Inter, font-normal)
- Audio Player Metadata: sm to base (Inter, font-medium)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24

**Vertical Rhythm:**
- Section padding: py-16 (mobile), py-24 (desktop)
- Component spacing: space-y-8 to space-y-12
- Card padding: p-6 to p-8

**Container Strategy:**
- Full-width hero sections with max-w-7xl inner content
- App interface: max-w-6xl centered container
- Mantra writing area: max-w-3xl (focused, distraction-free)
- Playlist cards: Grid system with gap-6

---

## Component Library

### Navigation
- Sticky header with glass-morphism effect (backdrop-blur)
- Logo + primary CTA ("Start Creating" button)
- Simple navigation: How It Works, Features, Playlists, Sign In

### Hero Section
**Large inspirational image:** Dawn/sunrise scene, person in peaceful meditation, or abstract uplifting gradient
- Overlay with backdrop-blur for text readability
- Headline: "Turn Your Goals into Songs that Move You"
- Subheadline describing transformation concept
- Primary CTA: "Create Your First Mantra Song" (prominent, blurred background)
- Secondary text: "Join 10,000+ people transforming their mindset through music"

### Mantra Writing Interface
- Large, focused textarea with subtle border
- Floating placeholder: "Write your goal, affirmation, or daily mantra..."
- Character count indicator (subtle, bottom-right)
- Genre selector: Icon-based pill buttons for 6 genres (soul, blues, hip-hop, reggae, pop, acoustic)
- Generate button: Primary, prominent placement

### Audio Player Component
- Rounded card with soft shadow
- Album art placeholder (abstract gradient visualization)
- Track title (user's mantra theme)
- Genre tag badge
- Playback controls: Previous, Play/Pause (large, centered), Next, Loop, Share
- Progress bar with time indicators
- Waveform visualization (subtle, decorative)

### Playlist Cards
**Three curated playlists:**
1. Morning Motivation (sunrise imagery)
2. Daytime Energy (vibrant, active imagery)
3. Bedtime Calm (peaceful night sky/moon imagery)

Card structure:
- Image backdrop (rounded-lg)
- Gradient overlay for text contrast
- Playlist name (text-xl, font-bold)
- Track count ("12 mantras")
- Play button (blurred background, centered)

### Song Library View
- Grid layout: 2 columns (mobile), 3-4 columns (desktop)
- Saved song cards showing mantra preview, genre, date created
- Filter/sort options: By genre, by playlist, by date
- Search bar for finding specific mantras

### Feature Showcase Section
**3-column grid (stacks on mobile):**
1. Write Your Mantras (icon: pen/paper)
2. Choose Your Genre (icon: music notes)
3. Listen & Transform (icon: headphones)

Each with icon, heading, description paragraph

### Social Proof Section
- Testimonial cards in 2-column layout
- User quote in Playfair Display italic
- User name and transformation story length indicator
- Subtle card elevation with hover lift effect

---

## Images

**Hero Section:** Large, full-width background image
- Type: Sunrise/peaceful nature scene, person meditating at dawn, or abstract uplifting gradient
- Treatment: Subtle overlay with backdrop-blur for text
- Placement: Full viewport height (80vh), centered content

**Playlist Cards:** Medium-sized card backgrounds
- Morning: Sunrise, golden hour, energizing scenes
- Daytime: Vibrant, active, colorful environments
- Bedtime: Peaceful night sky, moon, calming blue tones

**Feature Icons:** Use Heroicons via CDN
- Pen tool, musical note, headphones, sparkles, heart, bookmark

**App Screenshots:** Optional showcase section
- Desktop: Mantra writing interface in action
- Mobile: Audio player on phone mockup

---

## Animations

**Minimal, purposeful animations:**
- Button hover: subtle scale transform (scale-105)
- Card hover: gentle lift with shadow increase
- Audio player: Subtle pulse on play button when active
- Genre selector: Smooth selection state transition
- Page transitions: Fade-in content sections on scroll (use Intersection Observer)

**Avoid:** Excessive parallax, autoplay carousels, distracting background animations

---

## Accessibility

- Minimum touch target: 44px × 44px for all interactive elements
- Form labels visible and associated with inputs
- Audio player controls keyboard navigable
- Focus states: 2px ring with offset
- ARIA labels on icon-only buttons
- Color contrast minimum 4.5:1 for all text

---

## Mobile Considerations

- Mantra textarea: Full-width, comfortable touch size
- Genre selector: Horizontal scroll on mobile, grid on desktop
- Audio player: Sticky bottom position during playback
- Playlist cards: Single column stack on mobile
- Navigation: Hamburger menu on mobile with slide-in drawer

---

## Key Design Principles

1. **Emotionally Uplifting:** Use warm gradients, inspiring imagery, encouraging language
2. **Focused Creation:** Distraction-free writing experience with ample whitespace
3. **Smooth Audio Experience:** Professional music player controls, clear progress indication
4. **Personal Journey:** Organize by time of day (morning/day/night) reflecting daily rhythm
5. **Effortless Sharing:** Easy save/replay with optional social sharing