'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { PiArrowRight } from 'react-icons/pi';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ProductCard from '@/components/ProductCard';
import { filters, filterProducts, type ProductFilter } from '@/data/products';

const VALID: ProductFilter[] = ['all', 'men', 'women', 'bags'];

function ProductsView() {
  const containerRef = useScrollReveal();
  const searchParams = useSearchParams();
  const param = searchParams.get('c') as ProductFilter | null;
  const [active, setActive] = useState<ProductFilter>(
    param && VALID.includes(param) ? param : 'all'
  );

  // keep state in sync if the query param changes (e.g. navigating from home)
  useEffect(() => {
    if (param && VALID.includes(param)) setActive(param);
  }, [param]);

  const shown = useMemo(() => filterProducts(active), [active]);

  return (
    <div ref={containerRef}>
      {/* Hero — full-bleed image */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32">
        <Image
          src="/products/carismatico-vintage-brown-messenger-1.webp"
          alt="ARCTen leather collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/10 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="container-custom relative z-10 px-4 md:px-8 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <span className="reveal inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-cream/80">
              <span className="h-px w-10 bg-accent" />
              The Collection
            </span>
            <h1 className="reveal stagger-1 mt-6 font-heading text-5xl md:text-7xl text-cream leading-[0.9] text-balance">
              Leather, made
              <span className="block text-accent">to order</span>
            </h1>
            <p className="reveal stagger-2 mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-cream/70">
              Browse the styles we manufacture for wholesale and white-label partners.
              Every piece is a starting point — colors, hardware, and lining are yours to define.
            </p>

            <div className="reveal stagger-3 mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cream/15 pt-6 text-sm text-cream/65">
              <span>Leather Jackets</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Leather Bags</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>36 Signature Styles</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-cream/40 md:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
          <span className="h-12 w-px bg-gradient-to-b from-cream/50 to-transparent" />
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-0 z-20 border-y border-charcoal/5 bg-cream/80 py-4 backdrop-blur-xl">
        <div className="container-custom px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-500 ease-out-expo ${
                  active === f.key
                    ? 'bg-charcoal text-cream'
                    : 'bg-stone/50 text-charcoal/60 hover:bg-stone hover:text-charcoal'
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ml-auto hidden text-sm text-charcoal/40 sm:block">
              {shown.length} styles
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding pt-12 md:pt-16">
        <div className="container-custom px-4 md:px-8">
          {shown.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((product, i) => (
                <div
                  key={product.id}
                  className="reveal"
                  style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-heading text-2xl text-charcoal">Nothing here yet</p>
              <p className="mt-2 text-charcoal/50">Try another category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-charcoal">
        <div className="container-custom px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="reveal eyebrow mb-6 inline-block bg-accent/20 text-accent">
              Custom Orders
            </span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-5xl text-cream">
              Don&apos;t see your style?
            </h2>
            <p className="reveal stagger-2 mx-auto mt-6 max-w-xl text-lg text-cream/60">
              We build to spec. Send us a reference or sketch and we&apos;ll produce a
              sample with your choice of leather, hardware, and lining.
            </p>
            <Link
              href="/#quote"
              className="reveal stagger-3 btn-premium group mt-10 inline-flex bg-accent text-charcoal hover:bg-cream"
            >
              <span>Request a Custom Quote</span>
              <span className="btn-premium-icon bg-charcoal/10">
                <PiArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh]" />}>
      <ProductsView />
    </Suspense>
  );
}
