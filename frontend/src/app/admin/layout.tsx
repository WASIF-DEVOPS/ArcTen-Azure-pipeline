'use client';

import { AuthProvider } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-stone/30">
        {children}
      </div>
    </AuthProvider>
  );
}
