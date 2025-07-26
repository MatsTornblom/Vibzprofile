# Vibz Developer Template

A GitHub template for building applications in the Vibz ecosystem with consistent design and database access that integrates with external Vibz authentication.

## Using This Template

1. **Create a new repository** from this template by clicking the green "Use this template" button
2. **Clone your new repository** to your local machine
3. **Follow the Quick Start** instructions below

## Features

- **External Authentication Integration**: Seamlessly works with existing Vibz authentication system
- **Automatic Fullscreen Mode**: Automatically enters fullscreen mode on ANY user interaction (click, touch, keypress) for immersive experience - all Vibz apps should run in fullscreen
- **Consistent Design System**: Pre-configured Tailwind with Vibz design tokens
- **Database Access**: Ready-to-use Supabase client and user services
- **Mobile-First**: Responsive design optimized for mobile with desktop fallbacks
- **Version Management**: Built-in version checking and cache busting

## Fullscreen Philosophy

All Vibz ecosystem applications are designed to provide an **immersive, fullscreen experience**. This creates a more engaging, app-like feel that distinguishes Vibz applications from traditional websites.

### How It Works

- **Automatic Trigger**: As soon as a user interacts with the app (clicks, touches, or presses a key), it automatically enters fullscreen mode
- **Re-triggering**: If the user exits fullscreen (e.g., pressing Escape), the next interaction will re-enter fullscreen mode
- **Browser Compatibility**: Automatically detects and skips fullscreen for Meta browsers (Facebook, Instagram) where it's not supported
- **User Gesture Compliance**: Only triggers on valid user gestures to comply with browser security requirements

### Implementation

The fullscreen functionality is built into the template via the `useFullscreen` hook and is automatically active in all apps. No additional setup required.

## Quick Start

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## Authentication

The template integrates with the external Vibz authentication system. Users authenticate through the main Vibz platform, and this application reads the existing authentication state via cross-domain cookies.

### Key Components

- `lib/services/userService.ts` - User profile management
- `components/AccountButton.tsx` - User account display

### Usage

```tsx
import { getCurrentUser } from './lib/services/userService';

// Get current user
const user = await getCurrentUser();

// Authentication is handled externally at:
// - https://check.vibz.world/ (for testing)
// - https://enter.vibz.world/ (for account management)
```

## Database Access

Pre-configured Supabase client with cookie-based session management.

### Key Components

- `lib/api/supabase.ts` - Configured Supabase client
- `lib/api/errors.ts` - Error handling classes
- `lib/types/user.ts` - User type definitions

### Usage

```tsx
import { supabase } from './lib/api/supabase';

// Query data
const { data, error } = await supabase
  .from('your_table')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert([{ name: 'example' }]);
```

## UI Components

Consistent design components following Vibz design system.

### Available Components

- `Button` - Standard button with Vibz styling
- `useFullscreen` - Hook for managing fullscreen mode with auto-trigger functionality
- `Modal` - Backdrop modal with consistent styling
- `LoadingSpinner` - Animated loading indicator
- `ErrorMessage` - Error display component

### Design System

- **Colors**: Pink primary, white/black base
- **Typography**: Libre Bodoni font family
- **Spacing**: 8px grid system
- **Mobile-first**: Responsive breakpoints

## Hooks

Useful React hooks for common functionality.

- `useFullscreen` - Fullscreen management with browser detection and auto-trigger on user interaction
- `useCurrentUser` - User state management
- `useVersionCheck` - Version checking and cache busting

## Browser Compatibility

Built-in detection and handling for:
- Meta browsers (Facebook, Instagram)
- In-app browsers
- Mobile vs desktop environments

## Deployment

Configured for Netlify deployment with:
- Cache busting
- Version management
- Environment variable handling

## Development Guidelines

1. **Mobile-First**: Design for mobile, enhance for desktop
2. **External Auth**: Authentication is handled by external Vibz services
3. **Error Handling**: Use the provided error classes
4. **Type Safety**: Leverage TypeScript throughout

## File Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/
│   ├── api/           # API clients and services
│   ├── services/      # Business logic services
│   └── types/         # TypeScript definitions
└── styles/            # Global styles and design tokens
```

## Next Steps

1. Customize the example page for your specific app
2. Add your app-specific components and logic
3. Configure your subdomain and deployment
4. Test integration with external Vibz authentication

## Support

This template provides the foundation - build your unique features on top of this solid base!