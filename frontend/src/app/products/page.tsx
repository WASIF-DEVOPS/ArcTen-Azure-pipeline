'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
      {/* Hero */}
      <section className="pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="reveal eyebrow mb-6 inline-block">The Collection</span>
            <h1 className="reveal stagger-1 font-heading text-5xl md:text-7xl text-charcoal leading-[0.95]">
              Leather, made
              <span className="text-accent"> to order</span>
            </h1>
            <p className="reveal stagger-2 mt-6 max-w-xl text-lg leading-relaxed text-charcoal/60">
              Browse the styles we manufacture for wholesale and white-label partners.
              Every piece is a starting point — colors, hardware, and lining are yours to define.
            </p>
          </div>
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
