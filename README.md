# StreamVerse - Premium Streaming Platform

A modern, production-ready streaming platform inspired by Netflix, Disney+, and Prime Video. Built with Next.js 14, React 19, Firebase, and Tailwind CSS.

## 🚀 Features

### Authentication
- ✅ Email & Password Login/Register
- ✅ Google OAuth Integration
- ✅ GitHub OAuth Integration
- ✅ Password Reset
- ✅ Email Verification
- ✅ Session Persistence
- ✅ Role-based Access Control (Guest, User, Premium, Admin)

### Content Streaming
- ✅ Movie Catalog with Search & Filters
- ✅ TV Shows & Series Support
- ✅ Anime Section
- ✅ Trending Content
- ✅ Featured Content
- ✅ Multi-language Support

### User Features
- ✅ Watchlist Management
- ✅ Favorites Collection
- ✅ Watch History Tracking
- ✅ Continue Watching
- ✅ Ratings & Reviews
- ✅ User Profile Management
- ✅ Personalized Recommendations

### Streaming Player
- ✅ Full HD & 4K Support
- ✅ Multiple Playback Speeds
- ✅ Subtitle Selection
- ✅ Resume Playback
- ✅ Fullscreen & Picture-in-Picture
- ✅ Keyboard Shortcuts
- ✅ Volume Control

### Admin Dashboard
- ✅ Content Management (Movies, Shows, Episodes)
- ✅ Upload & Manage Media
- ✅ User Management
- ✅ Analytics Dashboard
- ✅ Subscription Management
- ✅ Report Management

### UI/UX
- ✅ Dark Cinematic Theme
- ✅ Glassmorphism Design
- ✅ Smooth Animations (Framer Motion)
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Premium Visual Effects
- ✅ Loading States & Skeletons

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Hosting**: Firebase Hosting, Vercel
- **Data Fetching**: TanStack Query, React Hook Form
- **Validation**: Zod
- **Video Player**: Shaka Player / Custom Player
- **Carousel**: Swiper.js
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase Project (create at [Firebase Console](https://console.firebase.google.com))
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/streamverse.git
cd streamverse
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# GitHub OAuth (Optional)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Setup Firebase

1. Create a new Firebase project
2. Enable Authentication methods (Email, Google, GitHub)
3. Create Firestore database in production mode
4. Configure Storage bucket
5. Copy your Firebase config

### 5. Create Firestore Collections

Run the following setup to create necessary collections (optional - can be auto-generated):

```bash
npm run setup:firebase
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
streamverse/
├── app/                      # Next.js App Router
│   ├── (app)/               # Main application routes
│   ├── (auth)/              # Authentication routes
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── common/             # Shared components (Navbar, Footer)
│   ├── player/             # Player components
│   └── sections/           # Page sections
├── context/                # React Context (Auth, Theme)
├── firebase/               # Firebase services
│   ├── config.ts          # Firebase config
│   ├── auth.ts            # Auth functions
│   ├── firestore.ts       # Firestore queries
│   └── storage.ts         # Storage functions
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & libraries
├── services/               # API services
├── types/                  # TypeScript types
├── utils/                  # Helper functions
│   ├── constants.ts       # App constants
│   └── helpers.ts         # Utility functions
├── public/                 # Static assets
├── styles/                 # Global styles
└── middleware.ts           # Auth middleware
```

## 🔐 Firebase Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Allow everyone to read public content
    match /movies/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    match /series/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // Allow users to write their own user interactions
    match /watchHistory/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    match /favorites/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }

    match /ratings/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access to media
    match /posters/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 🗄️ Firestore Collections Schema

### users
```typescript
{
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'guest' | 'user' | 'premium' | 'admin';
  subscription?: Subscription;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}
```

### movies
```typescript
{
  id: string;
  title: string;
  description: string;
  poster: string;
  banner: string;
  rating: number;
  year: number;
  duration: number;
  genres: string[];
  cast: CastMember[];
  director: string[];
  videoUrl: string;
  trailerUrl: string;
  views: number;
  isTrending: boolean;
  isFeatured: boolean;
  createdAt: Date;
}
```

### series
```typescript
{
  id: string;
  title: string;
  description: string;
  poster: string;
  banner: string;
  rating: number;
  year: number;
  genres: string[];
  totalSeasons: number;
  totalEpisodes: number;
  status: 'ongoing' | 'completed';
  isTrending: boolean;
  isFeatured: boolean;
  createdAt: Date;
}
```

### watchHistory
```typescript
{
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series';
  currentTime: number;
  duration: number;
  watchedAt: Date;
}
```

## 📦 API Routes

### Users
- `GET /api/users/[userId]` - Get user profile
- `POST /api/users` - Create user
- `PUT /api/users/[userId]` - Update user

### Movies
- `GET /api/movies` - Get movies list
- `GET /api/movies/[movieId]` - Get movie details
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/[movieId]` - Update movie (admin only)
- `DELETE /api/movies/[movieId]` - Delete movie (admin only)

### Watch History
- `GET /api/watch-history?userId=...` - Get user's watch history
- `POST /api/watch-history` - Add to watch history

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts`:

```typescript
const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      },
    },
  },
};
```

### Branding

Update in `utils/constants.ts`:

```typescript
export const APP_NAME = 'Your Platform Name';
export const APP_DESCRIPTION = 'Your description';
```

## 📱 Responsive Design

The platform is fully responsive:

- **Mobile**: 375px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

## 🔄 Deployment

### Deploy to Firebase Hosting

```bash
npm run build
firebase deploy
```

### Deploy to Vercel

```bash
vercel
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🐛 Troubleshooting

### Firebase Not Connecting

- Verify `.env.local` has correct Firebase credentials
- Check Firestore database is in production mode
- Ensure Firebase project has Authentication enabled

### Authentication Issues

- Clear browser cookies and cache
- Check Firebase Authentication settings
- Verify OAuth credentials are correct

### Video Not Playing

- Check Storage bucket has correct CORS configuration
- Verify video URL is accessible
- Test with different video format

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Netflix, Disney+, and Prime Video
- Built with Next.js and Firebase
- UI Design inspired by modern streaming platforms

## 📧 Support

For support, email support@streamverse.com or open an issue on GitHub.

---

**StreamVerse** - Premium Entertainment Streaming Platform

Made with ❤️ by Your Team
