'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin/quotes');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/admin/quotes');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-heading text-3xl text-charcoal">
              <span className="font-semibold">ARC</span>
              <span className="text-secondary">Ten</span>
            </h1>
          </Link>
          <p className="text-charcoal/50 text-sm mt-2">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="card-shell">
          <div className="card-inner p-8">
            <h2 className="font-heading text-2xl text-charcoal mb-2">Welcome back</h2>
            <p className="text-charcoal/50 text-sm mb-8">Sign in to manage quote requests</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-stone/30 border-0 rounded-xl text-charcoal 
                           placeholder:text-charcoal/40 transition-all duration-300
                           focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
                  placeholder="admin@arcten.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal/70 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-stone/30 border-0 rounded-xl text-charcoal 
                           placeholder:text-charcoal/40 transition-all duration-300
                           focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium justify-center py-3.5 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-charcoal/50 hover:text-charcoal transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
