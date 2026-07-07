import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - StreamVerse',
  description: 'Sign in or create an account to start streaming',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      {children}
    </div>
  );
}
