import { getTrendingMovies, getFeaturedMovies } from '@/firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'trending';
    const limit = parseInt(searchParams.get('limit') || '20');

    let movies;

    if (type === 'featured') {
      movies = await getFeaturedMovies(limit);
    } else {
      movies = await getTrendingMovies(limit);
    }

    return NextResponse.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}
