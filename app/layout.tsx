import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'StreamVerse - Premium Streaming Platform',
  description:
    'Watch movies, TV shows, and anime with premium quality streaming. StreamVerse offers the best entertainment experience.',
  keywords: 'streaming, movies, tv shows, anime, entertainment',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="StreamVerse - Premium Streaming Platform" />
        <meta property="og:description" content="Watch movies, TV shows, and anime with premium quality streaming" />
      </head>
      <body className="bg-black text-white">
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
