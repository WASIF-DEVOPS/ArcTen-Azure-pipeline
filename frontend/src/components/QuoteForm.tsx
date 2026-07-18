'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  productInterest: string;
  estimatedQuantity: string;
  additionalNotes: string;
}

export default function QuoteForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    phone: '',
    productInterest: '',
    estimatedQuantity: '',
    additionalNotes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/quote-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setFormData({
          companyName: '',
          email: '',
          phone: '',
          productInterest: '',
          estimatedQuantity: '',
          additionalNotes: '',
        });
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-charcoal mb-3">Quote Request Received</h3>
        <p className="text-charcoal/60 max-w-md mx-auto">{message}</p>
      </div>
    );
  }

  const inputClasses = `
    w-full px-5 py-4 bg-stone/30 border-0 rounded-2xl
    text-charcoal placeholder:text-charcoal/40
    transition-all duration-300 ease-out-expo
    focus:bg-white focus:ring-2 focus:ring-accent/20 focus:outline-none
  `;

  const labelClasses = "block text-sm font-medium text-charcoal/70 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="companyName" className={labelClasses}>Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="Your Company"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>Business Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClasses}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="productInterest" className={labelClasses}>Product Interest</label>
          <select
            id="productInterest"
            name="productInterest"
            value={formData.productInterest}
            onChange={handleChange}
            required
            className={`${inputClasses} cursor-pointer`}
          >
            <option value="">Select a category</option>
            <option value="leather-jackets">Leather Jackets</option>
            <option value="leather-bags">Leather Bags</option>
            <option value="both">Both Jackets & Bags</option>
            <option value="custom">Custom / Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="estimatedQuantity" className={labelClasses}>Estimated Quantity</label>
        <select
          id="estimatedQuantity"
          name="estimatedQuantity"
          value={formData.estimatedQuantity}
          onChange={handleChange}
          required
          className={`${inputClasses} cursor-pointer`}
        >
          <option value="">Select quantity range</option>
          <option value="50-100">50 - 100 units</option>
          <option value="100-500">100 - 500 units</option>
          <option value="500-1000">500 - 1,000 units</option>
          <option value="1000-5000">1,000 - 5,000 units</option>
          <option value="5000+">5,000+ units</option>
        </select>
      </div>

      <div>
        <label htmlFor="additionalNotes" className={labelClasses}>Additional Notes</label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={4}
          className={`${inputClasses} resize-none`}
          placeholder="Tell us about your project requirements, customization needs, timeline..."
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 text-red-700 px-5 py-4 rounded-2xl text-sm">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full btn-premium justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{status === 'loading' ? 'Submitting...' : 'Submit Quote Request'}</span>
        {status !== 'loading' && (
          <span className="btn-premium-icon">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        )}
      </button>

      <p className="text-xs text-charcoal/40 text-center">
        We typically respond within 24 business hours.
      </p>
    </form>
  );
}
