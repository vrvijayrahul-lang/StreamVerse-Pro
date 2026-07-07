# StreamVerse Developer Guide

## 📚 Quick Reference

### Project Overview
StreamVerse is a Netflix-inspired streaming platform built with modern web technologies. It provides a complete, production-ready streaming experience with authentication, video playback, content discovery, and user management.

### Tech Stack
- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Validation**: Zod, React Hook Form
- **HTTP Client**: Axios

---

## 🗂️ File Organization

### Core Application Files
```
app/
├── (app)/                    # Main application routes
├── (auth)/                   # Authentication routes
├── api/                      # Backend API routes
├── layout.tsx               # Root layout
└── globals.css              # Global styles
```

### Components
```
components/
├── common/                  # Reusable components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── player/                  # Media player components
│   └── MovieCard.tsx
└── sections/               # Page sections
    ├── HeroSection.tsx
    └── ContentSlider.tsx
```

### State & Logic
```
context/                     # React Context (Global State)
├── AuthContext.tsx

hooks/                       # Custom React Hooks
├── useAuthActions.ts
└── useUserList.ts

firebase/                    # Firebase Integration
├── config.ts
├── auth.ts
├── firestore.ts
└── storage.ts
```

### Utilities & Services
```
services/                    # API Services
├── api.ts

utils/                       # Utility Functions
├── constants.ts
├── helpers.ts

lib/                         # Library Functions
└── validation.ts

types/                       # TypeScript Definitions
└── index.ts
```

---

## 🚀 Getting Started

### Step 1: Setup Environment
```bash
# Clone repository
git clone <repo-url>
cd streamverse

# Install dependencies
npm install

# Run setup script (Windows)
setup.bat

# Run setup script (macOS/Linux)
bash setup.sh
```

### Step 2: Configure Firebase
1. Create Firebase project at https://firebase.google.com
2. Enable Authentication (Email, Google, GitHub)
3. Create Firestore database
4. Create Storage bucket
5. Copy credentials to `.env.local`

### Step 3: Update Environment Variables
Edit `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxxx
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 Development Tips

### Creating New Pages
1. Create file in `app/(app)/your-page/page.tsx`
2. Add 'use client' directive at top
3. Import necessary hooks and components
4. Use TypeScript for type safety
5. Add Framer Motion animations

### Creating New Components
1. Create file in `components/your-component/`
2. Follow existing naming conventions
3. Add prop types with TypeScript
4. Export component as default
5. Use Framer Motion for animations

### Adding New API Routes
1. Create file in `app/api/your-route/route.ts`
2. Export GET, POST, PUT, DELETE handlers
3. Add proper error handling
4. Return ApiResponse<T> type
5. Add authentication if needed

### Database Queries
Use functions from `firebase/firestore.ts`:
```typescript
import { getMovies, getMovieById } from '@/firebase/firestore';

// Get all movies
const movies = await getMovies();

// Get specific movie
const movie = await getMovieById('movie-id');
```

### File Uploads
Use functions from `firebase/storage.ts`:
```typescript
import { uploadFileWithProgress } from '@/firebase/storage';

// Upload with progress
const url = await uploadFileWithProgress(
  file,
  'movies/posters',
  (progress) => console.log(progress)
);
```

### Authentication
Use hooks from `hooks/useAuthActions.ts`:
```typescript
import { useAuthActions } from '@/hooks/useAuthActions';

const { login, logout, register } = useAuthActions();

// Login
await login(email, password);

// Logout
await logout();
```

### Global State
Access user context:
```typescript
import { useAuth } from '@/context/AuthContext';

const { currentUser, firebaseUser, userRole } = useAuth();
```

### User Content Operations
```typescript
import { useUserList } from '@/hooks/useUserList';

const {
  handleAddToFavorites,
  handleAddToWatchlist,
  handleGetWatchHistory,
} = useUserList();
```

### Form Validation
Use Zod schemas:
```typescript
import { loginSchema } from '@/lib/validation';

const validatedData = loginSchema.parse({
  email: 'user@example.com',
  password: 'password123',
});
```

---

## 🎨 Customization Guide

### Change App Name
Edit `utils/constants.ts`:
```typescript
export const APP_NAME = 'YourAppName';
```

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  accent: '#your-color',
  primary: '#your-color',
}
```

### Add New Font
Edit `tailwind.config.ts`:
```typescript
fontFamily: {
  sans: ['YourFont', 'system-ui'],
}
```

### Update Messages
Edit `utils/constants.ts`:
```typescript
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Your custom message',
};
```

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Use NEXT_PUBLIC_ only for public data
- ✅ Never commit .env.local to git
- ✅ Use environment variables for API keys
- ✅ Regenerate keys if exposed

### Firebase Security Rules
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Movies are publicly readable
    match /movies/{movieId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### API Route Protection
```typescript
// app/api/protected/route.ts
export async function GET(request: Request) {
  const token = request.headers.get('Authorization');
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Verify token with Firebase Admin SDK
  // Process request...
}
```

### Input Validation
Always validate user input:
```typescript
import { movieSchema } from '@/lib/validation';

try {
  const validated = movieSchema.parse(input);
} catch (error) {
  console.error('Validation failed:', error);
}
```

---

## 🐛 Troubleshooting

### Firebase Not Connecting
**Problem**: "Firebase config error"
**Solution**:
1. Check `.env.local` variables are correct
2. Verify Firebase project is active
3. Check Firestore is in production mode
4. Verify Storage bucket exists

### Video Not Playing
**Problem**: "Video fails to load"
**Solution**:
1. Check Storage URL is accessible
2. Verify CORS is configured
3. Try different video format
4. Check file permissions in Storage

### Styles Not Loading
**Problem**: "CSS not applying"
**Solution**:
1. Clear `.next` folder
2. Rebuild: `npm run build`
3. Restart dev server
4. Check Tailwind config

### Authentication Fails
**Problem**: "Can't login/register"
**Solution**:
1. Check Authentication is enabled in Firebase
2. Verify email verification settings
3. Check password requirements
4. Look at browser console errors

---

## 📊 Performance Tips

### Optimize Images
```typescript
import Image from 'next/image';

<Image
  src="/poster.jpg"
  alt="Movie"
  width={300}
  height={400}
  priority={true}
  placeholder="blur"
/>
```

### Use Memoization
```typescript
import { memo } from 'react';

const MovieCard = memo(({ movie }) => (
  // Component JSX
));
```

### Debounce Search
```typescript
import { debounce } from '@/utils/helpers';

const handleSearch = debounce((query) => {
  // Search logic
}, 300);
```

### Lazy Load Components
```typescript
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
  () => import('@/components/admin/Dashboard'),
  { loading: () => <p>Loading...</p> }
);
```

---

## 🧪 Testing Best Practices

### Component Testing
```typescript
// Create tests in __tests__ folder
// Use Jest and React Testing Library

describe('MovieCard', () => {
  it('should render movie title', () => {
    const movie = { title: 'Test Movie' };
    render(<MovieCard movie={movie} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
});
```

### API Testing
```typescript
// Test API routes
describe('/api/movies', () => {
  it('should return movies list', async () => {
    const response = await fetch('/api/movies');
    expect(response.status).toBe(200);
  });
});
```

---

## 🚀 Deployment Checklist

- [ ] Update `.env.local` with production values
- [ ] Set Firebase to production mode
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Setup error tracking (Sentry)
- [ ] Enable analytics
- [ ] Run security audit
- [ ] Test all authentication flows
- [ ] Verify video playback
- [ ] Check mobile responsiveness
- [ ] Setup CI/CD pipeline
- [ ] Configure CDN for media files

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)

---

## 📞 Support & Feedback

For issues, questions, or feature requests:
1. Check documentation files (README.md, IMPLEMENTATION.md, FEATURES.md)
2. Review existing code for similar implementations
3. Check browser console for error messages
4. Review Firebase console for issues

---

## 📝 Notes for Future Development

### Recommended Next Steps
1. Create admin dashboard for content management
2. Implement advanced search with filters
3. Add notification system
4. Setup payment integration (Stripe)
5. Add social sharing features

### Technical Debt
- Add comprehensive error boundaries
- Implement custom error logging
- Add performance metrics
- Setup automated testing
- Add storybook for components

### Scalability Improvements
- Implement caching strategy
- Optimize Firestore queries
- Add CDN for media files
- Implement rate limiting
- Add load testing

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅

Enjoy building with StreamVerse! 🎬✨
