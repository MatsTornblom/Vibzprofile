# Vibz Developer Guide

## Creating Your Project

This is a GitHub template repository. To start a new project:

1. **Click "Use this template"** on the GitHub repository page
2. **Create a new repository** with your project name
3. **Clone your new repository** (not this template)
4. **Follow the setup instructions** below

> **Note**: Don't fork this repository - use the template feature to get a clean copy without commit history.

## Overview

This template provides everything you need to build applications that integrate seamlessly with the Vibz ecosystem. All apps share the same external authentication system and design language while running on different subdomains.

## Architecture

### External Authentication Integration
- **Cookie-based sessions** shared across all `*.vibz.world` subdomains
- **External authentication** - users authenticate through dedicated Vibz services
- **Session consumption** - apps read existing authentication state without managing auth

### Shared Database
- **Single Supabase instance** shared across all applications
- **User profiles** automatically synced
- **Consistent data access** patterns

### Design System
- **Mobile-first** responsive design
- **Fullscreen experience** - automatically enters fullscreen on user interaction
- **Consistent styling** using Tailwind CSS
- **Vibz brand colors** and typography

## Getting Started

### 1. Environment Setup

Create a `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Install and Run

```bash
npm install
npm run dev
```

### 3. Test Authentication

1. Visit https://check.vibz.world/ to authenticate
2. Return to your app to see the authenticated state
3. Verify the session works across subdomains

## Key Components

### Authentication Integration

```tsx
// Check if user is signed in
const { user, loading } = useCurrentUser();

// Authentication is handled externally:
// - https://check.vibz.world/ (testing)
// - https://enter.vibz.world/ (account management)
```

### Database Queries

```tsx
import { supabase } from './lib/api/supabase';

// The client is pre-configured with cookie auth
const { data, error } = await supabase
  .from('your_table')
  .select('*')
  .eq('user_id', user.id);
```

### UI Components

```tsx
import { Button, Modal, LoadingSpinner } from './components/ui';

// Consistent styling across all apps
<Button variant="primary" onClick={handleClick}>
  Action
</Button>
```

## Development Guidelines

### 1. Mobile-First Design
- Design for mobile screens first
- Leverage fullscreen mode for immersive experience
- Use responsive breakpoints for desktop
- Test on actual mobile devices

### 2. External Authentication Testing
- Test with existing authenticated sessions
- Verify session reading across subdomains
- Check cookie domain compatibility

### 3. Error Handling
- Use the provided error classes
- Show user-friendly error messages
- Log technical details for debugging

### 4. Performance
- Leverage the built-in version checking
- Use proper loading states
- Optimize for mobile networks

## Customization

### Adding Your Features

1. **Create your pages** in `src/pages/`
2. **Add your components** in `src/components/`
3. **Define your routes** in `App.tsx`
4. **Add your database tables** (coordinate with main Vibz team)

### Styling Guidelines

- Use the Vibz color palette (`vibz-pink-500`, etc.)
- Follow the 8px spacing grid
- Use backdrop blur for overlays
- Maintain consistent border radius (rounded-lg, rounded-xl)

### Database Integration

- Always check user authentication before queries
- Use Row Level Security (RLS) policies
- Follow the existing user table structure
- Coordinate schema changes with the main team

## Deployment

### Netlify Configuration

The template includes Netlify configuration for:
- Automatic deployments
- Environment variable handling
- Cache busting
- Subdomain routing

### Subdomain Setup

1. Deploy your app to Netlify
2. Configure custom domain: `yourapp.vibz.world`
3. Test external authentication integration
4. Coordinate with main team for DNS setup

## Common Patterns

### Protected Routes

```tsx
function ProtectedPage() {
  const { user, loading } = useCurrentUser();
  
  if (loading) return <LoadingSpinner />;
  if (!user) {
    // Redirect to external auth
    window.location.href = 'https://check.vibz.world/';
    return null;
  }
  
  return <YourContent />;
}
```

### Error Boundaries

```tsx
try {
  const result = await someOperation();
} catch (error) {
  if (error instanceof DatabaseError) {
    // Handle database errors
  } else if (error instanceof AuthError) {
    // Handle auth errors
  }
}
```

### Responsive Design

```tsx
<div className="w-full md:w-auto md:max-w-md 
  p-4 md:p-6 
  text-base md:text-lg">
  Content
</div>
```

## Best Practices

1. **Test external authentication** integration across subdomains
2. **Use TypeScript** for type safety
3. **Handle loading states** gracefully
4. **Provide error feedback** to users
5. **Follow mobile-first** design principles
6. **Coordinate database changes** with the team
7. **Test on real devices** not just browser dev tools

## Support

- Check the main Vibz app for implementation examples
- Coordinate with the team for database schema changes
- Test thoroughly before deploying to production

Happy building! 🚀