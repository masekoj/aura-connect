
# Aura — Dating Web App MVP Plan 🔮

**Tagline:** "Find your vibe, spark your aura"

A mobile-first PWA dating app focused on authentic connections through personality/energy matching, featuring aura colors, vibe-based discovery, and meaningful matching over shallow swiping.

---

## Phase 1: Foundation & Auth

### PWA Setup
- Install as native app from browser, offline support, mobile-optimized viewport
- Service worker with proper caching (excluding auth routes)

### Design System
- Aura-inspired gradient palette (purples, pinks, blues, golds)
- Glassmorphism cards with soft shadows and aura glows
- Inter font, smooth 60fps micro-animations (card swipes, aura pulses)
- Dark mode support from day one

### Authentication
- Lovable Cloud backend setup
- Email/password signup & login
- Google OAuth sign-in
- Apple OAuth sign-in
- Protected routes for authenticated users

---

## Phase 2: Onboarding Flow

### Animated Splash Screen
- Glowing "Aura" logo with animated aura effect
- Smooth transition into onboarding

### 6-Step Onboarding Wizard
1. **Name & Birthday** — age verification (18+)
2. **Gender & Preferences** — who you are and who you're looking for
3. **Photos** — upload 3-6 photos with validation, selfie verification prompt
4. **Bio** — short bio with AI-suggested starter prompts
5. **Aura Colors** — pick 1-3 primary aura colors (blue=calm, red=passionate, green=growth, purple=creative, gold=confident, pink=romantic)
6. **Vibe Questions** — 6-8 fun personality questions (morning/night owl, adventure/chill, deep talks/light laughs, long-term/casual, etc.)

### Aura Calculation
- Combine color selections + vibe answers → dominant aura color, personality traits, and compatibility profile
- Visual reveal animation showing your unique aura

### Progress indicators and micro-animations throughout to reduce drop-off

---

## Phase 3: Profile

### Profile Card
- Photo carousel with swipe navigation
- Aura color glow ring around profile photo
- Name, age, city-level location, verification badge
- Bio, aura traits/colors displayed as colorful tags
- Interests and values tags
- Dynamic "Aura Energy" visual ring that evolves with interactions

### Edit Profile
- Update photos, bio, aura preferences, vibe answers
- Re-calculate aura on changes

---

## Phase 4: Discovery Feed

### Card-Based Swiping
- Swipeable profile cards (left to pass, right to like)
- Each card shows: photo, name, age, aura glow, top 2 traits, short vibe quote
- Action buttons: ❤️ Like, ✨ Super Like (limited daily), 👎 Pass, ⭐ Favorite

### Filters
- Age range, distance/city, aura color preference, interests, relationship intentions

### Smart Discovery
- Daily curated picks mode (limited swipes to encourage quality)
- AI-recommended high-compatibility profiles with compatibility reasons

---

## Phase 5: Matching & Compatibility

### Match Screen
- Confetti + aura merge animation (two aura colors blending together)
- "Aura Compatibility" percentage with breakdown (shared interests, aura harmony, vibe alignment)
- Immediate option to start chatting

### Matching Algorithm
- Weighted scoring: aura color harmony + shared interests + vibe question alignment + preference match
- Store match data for future algorithm improvements

---

## Phase 6: Chat & Messaging

### Modern Messenger
- Real-time messaging between matched users
- Read receipts and typing indicators
- Message reactions (emoji)
- Photo and voice note sharing via storage

### Smart Features
- AI-generated icebreaker prompts based on aura/vibe compatibility
- AI-suggested responses (toggleable)
- "Nudge" feature for stalled conversations

---

## Phase 7: Safety, Notifications & Extras

### Safety & Trust
- Photo verification badge system
- Report and block tools on every profile and in chat
- Basic message moderation flagging

### Notifications
- In-app notifications for matches, messages, likes
- Push notification setup for key events

### Wellness Features
- Daily vibe check-in prompt
- Swipe limit reminders to prevent burnout
- "Take a break" gentle nudges
- Positive reinforcement on matches (tips, encouragement)

### Location
- Browser geolocation or manual city input
- Privacy controls for location sharing

---

## Phase 8: Premium Tier & Polish

### Premium UI (Stripe teaser)
- Premium tier page showing: unlimited likes, see who likes you, advanced aura insights, ad-free, priority in discovery
- Subtle paywall — value-first approach
- Stripe integration ready for payment processing

### Analytics Hooks
- Track key events: signups, onboarding completion, swipes, matches, message rates
- Foundation for future iteration on match quality and engagement

---

## Database Schema (Lovable Cloud / Supabase)

- **profiles** — user details, photos, bio, aura colors, traits, location, verification status
- **vibe_answers** — user responses to personality questions
- **swipes** — who swiped whom and how (like/pass/super)
- **matches** — mutual likes with compatibility score
- **messages** — chat messages between matches
- **favorites** — saved/starred profiles
- **reports** — safety reports and blocks
- **notifications** — in-app notification log
- **premium_subscriptions** — premium status tracking

---

## Key Technical Decisions
- **Lovable Cloud** for managed Supabase backend (auth, database, storage, edge functions)
- **PWA** with installable app experience and offline support
- **Email + Google + Apple** authentication
- **Supabase Storage** for photo uploads
- **Real-time subscriptions** for chat and notifications
- **Edge functions** for aura calculation, AI suggestions, and matching logic
