# StreamVerse Deployment Guide

## 🚀 Deployment Overview

StreamVerse can be deployed to multiple platforms. This guide covers the most popular options.

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase project set to production
- [ ] Firestore security rules configured
- [ ] Storage rules configured
- [ ] CORS settings updated
- [ ] CDN setup for media files
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics enabled
- [ ] All dependencies installed
- [ ] Production build successful (`npm run build`)
- [ ] Tests passing (if applicable)

---

## 🔧 Production Environment Setup

### Update .env.local for Production

```env
# Firebase Production Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API URL
NEXT_PUBLIC_API_URL=https://yourdomain.com

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id

# Optional: Error Tracking
SENTRY_DSN=your_sentry_dsn
```

### Build Production Bundle

```bash
npm run build
npm run start
```

---

## 🌐 Option 1: Vercel Deployment (Recommended)

Vercel is the optimal choice for Next.js applications.

### Step 1: Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Import the project

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add all `.env.local` variables
3. Click Save

### Step 4: Deploy

```bash
# Option 1: Via Dashboard - Click Deploy button
# Option 2: Via CLI
npm i -g vercel
vercel
```

### Step 5: Configure Domain

1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS settings with Vercel nameservers

### Verify Deployment

```
https://yourdomain.com
```

---

## 🔥 Option 2: Firebase Hosting

Firebase Hosting is ideal for Firebase projects.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase

```bash
firebase init hosting
```

Select:
- Public directory: `.next/static`
- Configure as single-page app: No
- Set up automatic builds: Yes

### Step 3: Create firebase.json

```json
{
  "hosting": {
    "public": ".next/static",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      }
    ]
  }
}
```

### Step 4: Build and Deploy

```bash
npm run build
firebase deploy
```

---

## ☁️ Option 3: AWS Amplify

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify

```bash
amplify init
```

### Step 3: Add Hosting

```bash
amplify add hosting
```

Select:
- Hosting service: CloudFront and S3
- Environment: prod

### Step 4: Deploy

```bash
npm run build
amplify publish
```

---

## 🚀 Option 4: Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### Build and Deploy

```bash
# Build image
docker build -t streamverse:latest .

# Run locally
docker run -p 3000:3000 streamverse:latest

# Push to registry
docker tag streamverse:latest your-registry/streamverse:latest
docker push your-registry/streamverse:latest
```

---

## 📱 Option 5: AWS App Runner

### Step 1: Create Repository

Push your code to GitHub or AWS CodeCommit.

### Step 2: Use AWS Console

1. Go to AWS App Runner
2. Click "Create Service"
3. Select GitHub repository
4. Configure build settings
5. Add environment variables

### Step 3: Deploy

Click "Create & Deploy"

---

## 🔐 Post-Deployment Security

### Configure Firebase Security Rules

**Firestore Rules** (`firestore.rules`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if request.auth.uid == userId || isAdmin();
      allow write: if request.auth.uid == userId;
    }

    // Movies (public read)
    match /movies/{movieId} {
      allow read;
      allow write: if isAdmin();
    }

    // Watch History
    match /watchHistory/{document=**} {
      allow read, write: if request.auth != null;
    }

    // Function to check admin
    function isAdmin() {
      return request.auth.token.role == 'admin';
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Configure Storage Rules

**Storage Rules** (`storage.rules`):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public media files
    match /media/{allPaths=**} {
      allow read;
      allow write: if request.auth != null && isAdmin();
    }

    // User uploads
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // Function to check admin
    function isAdmin() {
      return request.auth.token.role == 'admin';
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only storage
```

### Configure CORS

```bash
# Create cors.json
cat > cors.json << 'EOF'
[
  {
    "origin": ["https://yourdomain.com"],
    "method": ["GET", "HEAD", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

# Apply CORS
gsutil cors set cors.json gs://your-bucket
```

---

## 📊 Monitoring & Analytics

### Setup Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.js`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Enable Google Analytics

Add to `app/layout.tsx`:

```typescript
import Script from 'next/script';

<Script
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
/>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `,
  }}
/>
```

---

## 🔄 Continuous Deployment

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🎯 Performance Optimization

### Enable Caching

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
};

module.exports = nextConfig;
```

### Configure CDN

For Firebase Storage:
```typescript
// Use cached URLs for static content
const getCachedMediaUrl = (path: string) => {
  return `https://cdn.yourdomain.com/${path}`;
};
```

---

## 📈 Scaling Strategies

### Database Optimization

1. Add indexes in Firestore
2. Implement caching layer
3. Use pagination for large datasets
4. Optimize queries

### Storage Optimization

1. Compress videos before upload
2. Use multiple quality versions
3. Implement progressive loading
4. Use CDN distribution

### Server Optimization

1. Enable gzip compression
2. Minify assets
3. Enable caching headers
4. Use server-side rendering strategically

---

## 🆘 Troubleshooting Deployment

### Build Fails

```bash
# Clear cache
rm -rf .next
rm -rf node_modules

# Reinstall
npm install
npm run build
```

### Env Variables Not Loading

1. Verify all variables are set in deployment platform
2. Check variable names match exactly
3. Ensure `NEXT_PUBLIC_` prefix for client variables
4. Restart deployment after updating

### Firebase Connection Issues

1. Check credentials are correct
2. Verify Firebase project is active
3. Check Firestore location matches config
4. Verify Security Rules allow access

### Videos Not Playing

1. Check Storage URLs are accessible
2. Verify CORS configuration
3. Check Security Rules allow read
4. Test video format compatibility

---

## 📞 Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [AWS Amplify](https://aws.amplify.dev)
- [Docker Docs](https://docs.docker.com)

---

## ✅ Deployment Verification

After deployment, verify:

- [ ] Website loads without errors
- [ ] Login/Register works
- [ ] Videos play correctly
- [ ] Search functionality works
- [ ] Watchlist operations work
- [ ] Profile settings save
- [ ] Mobile responsive
- [ ] HTTPS working
- [ ] No console errors
- [ ] Analytics tracking

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅

Congratulations on deploying StreamVerse! 🎉
