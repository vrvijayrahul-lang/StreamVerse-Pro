# StreamVerse API Reference

## 📡 API Endpoints Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All API requests (except public endpoints) require:
```
Authorization: Bearer <Firebase_ID_Token>
```

The token is automatically added via Axios interceptor in `services/api.ts`.

---

## 🎬 Movies Endpoints

### Get All Movies
```
GET /api/movies
```

**Query Parameters:**
- `limit` (number, optional): Number of movies to return (default: 20)
- `type` (string, optional): 'trending' | 'featured'

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "movie-1",
      "title": "Movie Title",
      "description": "Movie description",
      "posterUrl": "https://...",
      "rating": 8.5,
      "year": 2023,
      "duration": 120,
      "genres": ["Action", "Thriller"]
    }
  ]
}
```

### Get Movie By ID
```
GET /api/movies/:movieId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "movie-1",
    "title": "Movie Title",
    "description": "Full description",
    "posterUrl": "https://...",
    "bannerUrl": "https://...",
    "videoUrl": "https://...",
    "trailerUrl": "https://...",
    "rating": 8.5,
    "year": 2023,
    "duration": 120,
    "language": "English",
    "genres": ["Action", "Thriller"],
    "cast": [
      { "name": "Actor Name", "character": "Character Name" }
    ],
    "directors": ["Director Name"],
    "viewCount": 15000
  }
}
```

---

## 👥 Users Endpoints

### Get User Profile
```
GET /api/users/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-1",
    "email": "user@example.com",
    "displayName": "User Name",
    "photoURL": "https://...",
    "role": "user",
    "subscription": {
      "plan": "premium",
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "autoRenew": true,
      "status": "active"
    },
    "preferences": {
      "theme": "dark",
      "language": "en",
      "autoPlay": true,
      "qualityPreference": "1080p"
    },
    "createdAt": "2024-01-01"
  }
}
```

### Update User Profile
```
PUT /api/users/:userId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "displayName": "New Name",
  "photoURL": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-1",
    "displayName": "New Name",
    "photoURL": "https://..."
  }
}
```

---

## 👁️ Watch History Endpoints

### Add Watch History
```
POST /api/watch-history
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "contentId": "movie-1",
  "contentType": "movie",
  "currentTime": 3600,
  "duration": 7200,
  "episodeId": "optional-episode-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "history-1",
    "contentId": "movie-1",
    "contentType": "movie",
    "currentTime": 3600,
    "duration": 7200,
    "watchedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Watch History
```
GET /api/watch-history
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number, optional): Number of items to return (default: 20)
- `offset` (number, optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "history-1",
      "contentId": "movie-1",
      "contentType": "movie",
      "currentTime": 3600,
      "duration": 7200,
      "watchedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## ❤️ Favorites Endpoints

### Add to Favorites
```
POST /api/favorites
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "contentId": "movie-1",
  "contentType": "movie"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "favorite-1",
    "contentId": "movie-1",
    "contentType": "movie",
    "addedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Remove from Favorites
```
DELETE /api/favorites/:contentId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from favorites"
}
```

### Get Favorites
```
GET /api/favorites
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "favorite-1",
      "contentId": "movie-1",
      "contentType": "movie",
      "movie": {
        "id": "movie-1",
        "title": "Movie Title",
        "posterUrl": "https://..."
      },
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 📋 Watchlist Endpoints

### Add to Watchlist
```
POST /api/watchlist
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "contentId": "movie-1",
  "contentType": "movie"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "watchlist-1",
    "contentId": "movie-1",
    "contentType": "movie",
    "addedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Remove from Watchlist
```
DELETE /api/watchlist/:contentId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Removed from watchlist"
}
```

### Get Watchlist
```
GET /api/watchlist
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "watchlist-1",
      "contentId": "movie-1",
      "contentType": "movie",
      "movie": {
        "id": "movie-1",
        "title": "Movie Title",
        "posterUrl": "https://...",
        "rating": 8.5
      },
      "addedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## ⭐ Ratings Endpoints

### Add/Update Rating
```
POST /api/ratings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "contentId": "movie-1",
  "contentType": "movie",
  "rating": 8
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rating-1",
    "contentId": "movie-1",
    "contentType": "movie",
    "rating": 8,
    "ratedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Rating
```
GET /api/ratings/:contentId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rating-1",
    "contentId": "movie-1",
    "rating": 8,
    "ratedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 💬 Reviews Endpoints

### Add Review
```
POST /api/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "contentId": "movie-1",
  "contentType": "movie",
  "title": "Great Movie",
  "content": "This is an amazing movie!",
  "rating": 8
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "review-1",
    "contentId": "movie-1",
    "title": "Great Movie",
    "content": "This is an amazing movie!",
    "rating": 8,
    "authorId": "user-1",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Reviews
```
GET /api/reviews/:contentId
```

**Query Parameters:**
- `limit` (number, optional): Number of reviews to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "review-1",
      "contentId": "movie-1",
      "title": "Great Movie",
      "content": "This is an amazing movie!",
      "rating": 8,
      "author": {
        "id": "user-1",
        "displayName": "User Name",
        "photoURL": "https://..."
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🔔 Notifications Endpoints

### Get Notifications
```
GET /api/notifications
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number, optional): Number of notifications (default: 20)
- `read` (boolean, optional): Filter by read status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-1",
      "type": "new_release",
      "title": "New Movie Available",
      "message": "Check out the latest release!",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Mark Notification as Read
```
PUT /api/notifications/:notificationId
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "read": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "notif-1",
    "read": true
  }
}
```

---

## 🔍 Search Endpoints

### Search Content
```
GET /api/search
```

**Query Parameters:**
- `q` (string, required): Search query
- `type` (string, optional): 'movie' | 'series' | 'all'
- `genre` (string, optional): Filter by genre
- `year` (number, optional): Filter by year
- `limit` (number, optional): Results limit (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "movie-1",
      "title": "Movie Title",
      "type": "movie",
      "posterUrl": "https://...",
      "rating": 8.5,
      "year": 2023
    }
  ]
}
```

---

## 📊 Analytics Endpoints

### Get User Analytics
```
GET /api/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalWatched": 25,
    "totalHours": 150,
    "averageRating": 8.2,
    "favoriteGenre": "Action",
    "recentActivity": [
      {
        "contentId": "movie-1",
        "title": "Movie Title",
        "watchedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Track Event
```
POST /api/analytics/track
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "event": "video_played",
  "data": {
    "movieId": "movie-1",
    "duration": 120
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event tracked successfully"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| BAD_REQUEST | 400 | Invalid request data |
| VALIDATION_ERROR | 400 | Validation failed |
| SERVER_ERROR | 500 | Internal server error |

---

## 📝 Request Examples

### JavaScript/TypeScript with Fetch

```typescript
// Get movies
const response = await fetch('/api/movies?limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Using Axios (Recommended)

```typescript
import { apiService } from '@/services/api';

// Get movies
const response = await apiService.getMovies(20);

// Add to favorites
await apiService.addToFavorites('movie-1', 'movie');

// Get watch history
const history = await apiService.getWatchHistory(50);
```

### Using React Hooks

```typescript
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';

function MyComponent() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    apiService.getMovies(10).then(response => {
      if (response.success) {
        setMovies(response.data);
      }
    });
  }, []);

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
}
```

---

## 🔐 Security Notes

1. **Authentication Required**: All endpoints except search and public movie list require Firebase token
2. **Rate Limiting**: Implement rate limiting for production
3. **Input Validation**: All inputs are validated with Zod schemas
4. **Data Privacy**: User data is protected by Firestore security rules
5. **CORS**: Configure CORS for your domain

---

## 🚀 Deployment

Update `NEXT_PUBLIC_API_URL` in `.env.local` for your deployment:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
