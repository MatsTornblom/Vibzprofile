# Vibz Developer Template

A starter template for building applications in the Vibz ecosystem with consistent authentication, design, and database access.

## Features

- **Cross-Domain Authentication**: Cookie-based auth that works across all Vibz subdomains
- **Consistent Design System**: Pre-configured Tailwind with Vibz design tokens
- **Database Access**: Ready-to-use Supabase client and user services
- **Mobile-First**: Responsive design optimized for mobile with desktop fallbacks
- **Version Management**: Built-in version checking and cache busting

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

The template uses a custom cookie-based authentication system that enables seamless login across all Vibz subdomains.

### Key Components

- `lib/auth/service.ts` - Authentication functions
- `lib/services/userService.ts` - User profile management
- `components/auth/AuthForm.tsx` - Login/signup form
- `components/AccountButton.tsx` - User account display

### Usage

```tsx
import { getCurrentUser, setCurrentUser } from './lib/services/userService';
import { signInWithEmail, signUpWithEmail, signOut } from './lib/auth/service';

// Get current user
const user = await getCurrentUser();

// Sign in
const result = await signInWithEmail(email, password);

// Sign up
const result = await signUpWithEmail(email, password);

// Sign out
await signOut();
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

- `useFullscreen` - Fullscreen management with browser detection
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
2. **Cross-Domain**: Always test authentication across subdomains
3. **Error Handling**: Use the provided error classes
4. **Type Safety**: Leverage TypeScript throughout

## File Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/
│   ├── api/           # API clients and services
│   ├── auth/          # Authentication logic
│   ├── services/      # Business logic services
│   └── types/         # TypeScript definitions
└── styles/            # Global styles and design tokens
```

## Next Steps

1. Customize the example page for your specific app
2. Add your app-specific components and logic
3. Configure your subdomain and deployment
4. Test cross-domain authentication

## Support

This template provides the foundation - build your unique features on top of this solid base!