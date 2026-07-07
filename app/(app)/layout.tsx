import type { Metadata } from 'next';
import Navbar from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'StreamVerse - Premium Streaming Platform',
  description: 'Watch movies, TV shows, and anime with premium quality streaming',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {children}
    </div>
  );
}
