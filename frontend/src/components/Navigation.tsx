'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/products', label: 'Products' },
    { href: '/manufacturing', label: 'Manufacturing' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 pt-6">
        <nav className={`
          mx-auto max-w-5xl flex items-center justify-between 
          px-4 md:px-6 py-3 rounded-full
          transition-all duration-700 ease-out-expo
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03]' 
            : 'bg-cream/60 backdrop-blur-md ring-1 ring-black/[0.02]'}
        `}>
          <Link href="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`relative px-4 py-2 text-sm font-medium 
                         transition-all duration-300 ease-out-expo
                         rounded-full hover:bg-black/[0.03] ${
                           isActive(link.href)
                             ? 'text-charcoal'
                             : 'text-charcoal/70 hover:text-charcoal'
                         }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-px bg-accent" />
                )}
              </Link>
            ))}
            <Link href="/#quote" className="btn-premium ml-2 text-sm py-2.5 px-5 group">
              <span>Request Quote</span>
              <span className="btn-premium-icon w-6 h-6">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full
                     bg-charcoal/5 transition-colors duration-300 hover:bg-charcoal/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={`
                block h-[1.5px] bg-charcoal rounded-full transition-all duration-500 ease-out-expo origin-center
                ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}
              `} />
              <span className={`
                block h-[1.5px] bg-charcoal rounded-full transition-all duration-300 ease-out-expo
                ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}
              `} />
              <span className={`
                block h-[1.5px] bg-charcoal rounded-full transition-all duration-500 ease-out-expo origin-center
                ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}
              `} />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 z-30 md:hidden
        transition-all duration-700 ease-out-expo
        ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="absolute inset-0 bg-cream/95 backdrop-blur-3xl" />
        
        <div className="relative h-full flex flex-col items-center justify-center px-8">
          <nav className="flex flex-col items-center gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  text-4xl font-heading font-semibold text-charcoal
                  transition-all duration-700 ease-out-expo
                  hover:text-accent
                  ${isMenuOpen 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: isMenuOpen ? `${150 + i * 50}ms` : '0ms' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <Link 
            href="/#quote" 
            onClick={() => setIsMenuOpen(false)}
            className={`
              btn-premium mt-12 text-lg group
              transition-all duration-700 ease-out-expo
              ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: isMenuOpen ? '350ms' : '0ms' }}
          >
            <span>Request Quote</span>
            <span className="btn-premium-icon">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
