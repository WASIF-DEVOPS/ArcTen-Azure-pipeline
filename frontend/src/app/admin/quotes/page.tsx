'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Quote {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  productInterest: string;
  estimatedQuantity: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  'in-progress': number;
  quoted: number;
  closed: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-purple-100 text-purple-700',
  quoted: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  'in-progress': 'In Progress',
  quoted: 'Quoted',
  closed: 'Closed',
};

export default function QuotesDashboard() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading, logout } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (token) {
      fetchQuotes();
      fetchStats();
    }
  }, [token, filter, search]);

  const fetchQuotes = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (search) params.append('search', search);

      const res = await fetch(`${API_URL}/api/admin/quotes?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setQuotes(data.data);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/quotes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.map(q => q._id === id ? { ...q, status } : q));
        if (selectedQuote?._id === id) {
          setSelectedQuote({ ...selectedQuote, status });
        }
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/quotes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.filter(q => q._id !== id));
        setDeleteConfirm(null);
        if (selectedQuote?._id === id) {
          setSelectedQuote(null);
        }
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatProduct = (product: string) => {
    return product.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-charcoal/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-heading text-xl text-charcoal">
              <span className="font-semibold">ARC</span>
              <span className="text-secondary">Ten</span>
            </Link>
            <span className="text-charcoal/30">|</span>
            <span className="text-sm text-charcoal/50">Admin Dashboard</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, color: 'bg-charcoal text-cream' },
              { label: 'New', value: stats.new, color: 'bg-blue-500 text-white' },
              { label: 'Contacted', value: stats.contacted, color: 'bg-yellow-500 text-white' },
              { label: 'In Progress', value: stats['in-progress'], color: 'bg-purple-500 text-white' },
              { label: 'Quoted', value: stats.quoted, color: 'bg-green-500 text-white' },
              { label: 'Closed', value: stats.closed, color: 'bg-gray-400 text-white' },
            ].map((stat) => (
              <div key={stat.label} className="card-shell">
                <div className="card-inner p-4 text-center">
                  <p className={`text-3xl font-heading ${stat.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-lg`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-charcoal/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by company or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-white border-0 rounded-xl text-charcoal 
                       placeholder:text-charcoal/40 ring-1 ring-charcoal/10
                       focus:ring-2 focus:ring-accent/20 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'new', 'contacted', 'in-progress', 'quoted', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${filter === status 
                    ? 'bg-charcoal text-cream' 
                    : 'bg-white text-charcoal/60 hover:bg-charcoal/5'}`}
              >
                {status === 'all' ? 'All' : statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        {/* Quotes List */}
        <div className="card-shell">
          <div className="card-inner overflow-hidden">
            {quotes.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-charcoal/40">No quotes found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-charcoal/5">
                      <th className="text-left p-4 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Company</th>
                      <th className="text-left p-4 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Contact</th>
                      <th className="text-left p-4 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Product</th>
                      <th className="text-left p-4 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Quantity</th>
                      <th className="text-left p-4 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Status</th>
                      <th className="text-left p-4 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Date</th>
                      <th className="text-right p-4 text-xs font-medium text-charcoal/50 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((quote) => (
                      <tr 
                        key={quote._id} 
                        className="border-b border-charcoal/5 hover:bg-stone/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedQuote(quote)}
                      >
                        <td className="p-4">
                          <p className="font-medium text-charcoal">{quote.companyName}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-charcoal">{quote.email}</p>
                          <p className="text-xs text-charcoal/50">{quote.phone}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-charcoal">{formatProduct(quote.productInterest)}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-accent">{quote.estimatedQuantity}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[quote.status]}`}>
                            {statusLabels[quote.status]}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-charcoal/50">{formatDate(quote.createdAt)}</span>
                        </td>
                        <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={quote.status}
                              onChange={(e) => updateStatus(quote._id, e.target.value)}
                              className="px-2 py-1.5 text-xs bg-stone/30 border-0 rounded-lg cursor-pointer
                                       focus:ring-2 focus:ring-accent/20 focus:outline-none"
                            >
                              {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setDeleteConfirm(quote._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedQuote(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-charcoal/5 flex items-center justify-between">
              <h3 className="font-heading text-xl text-charcoal">Quote Details</h3>
              <button onClick={() => setSelectedQuote(null)} className="text-charcoal/40 hover:text-charcoal">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Company</p>
                <p className="font-medium text-charcoal">{selectedQuote.companyName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${selectedQuote.email}`} className="text-accent hover:underline">{selectedQuote.email}</a>
                </div>
                <div>
                  <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Phone</p>
                  <a href={`tel:${selectedQuote.phone}`} className="text-charcoal">{selectedQuote.phone}</a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Product Interest</p>
                  <p className="text-charcoal">{formatProduct(selectedQuote.productInterest)}</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Quantity</p>
                  <p className="font-medium text-accent">{selectedQuote.estimatedQuantity} units</p>
                </div>
              </div>
              {selectedQuote.additionalNotes && (
                <div>
                  <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-charcoal text-sm bg-stone/30 p-3 rounded-xl">{selectedQuote.additionalNotes}</p>
                </div>
              )}
              <div className="pt-4 border-t border-charcoal/5">
                <p className="text-xs text-charcoal/40">
                  Submitted on {formatDate(selectedQuote.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading text-xl text-charcoal mb-2">Delete Quote?</h3>
            <p className="text-charcoal/60 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone/50 text-charcoal font-medium hover:bg-stone transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteQuote(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
