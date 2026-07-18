'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PiArrowLeft, PiArrowRight, PiCheck } from 'react-icons/pi';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ProductCard from '@/components/ProductCard';
import { relatedProducts, type Product } from '@/data/products';

export default function ProductDetail({ product }: { product: Product }) {
  const containerRef = useScrollReveal();
  const gallery = Array.from(new Set([product.image, product.hoverImage]));
  const [active, setActive] = useState(gallery[0]);
  const related = relatedProducts(product);

  const backHref =
    product.category === 'bags'
      ? '/products'
      : `/products`;

  return (
    <div ref={containerRef}>
      <section className="pt-28 md:pt-32">
        <div className="container-custom px-4 md:px-8">
          {/* Breadcrumb / back */}
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-charcoal/50 transition-colors hover:text-charcoal"
          >
            <PiArrowLeft className="h-4 w-4" />
            <span>Back to products</span>
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone/40">
                <Image
                  src={active}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-3">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      onClick={() => setActive(src)}
                      className={`relative aspect-square w-20 overflow-hidden rounded-xl bg-stone/40 ring-2 transition-all md:w-24 ${
                        active === src ? 'ring-accent' : 'ring-transparent hover:ring-charcoal/20'
                      }`}
                    >
                      <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-4">
              <span className="eyebrow mb-4 inline-block">
                {product.category === 'bags'
                  ? 'Leather Bag'
                  : product.gender === 'women'
                  ? "Women's Jacket"
                  : "Men's Jacket"}
              </span>
              <h1 className="font-heading text-4xl leading-tight text-charcoal md:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal/50">
                <span>{product.style}</span>
                {product.color && (
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {product.color}
                  </span>
                )}
              </div>

              <p className="mt-6 max-w-md leading-relaxed text-charcoal/60">
                Handcrafted from full-grain leather and finished by our master artisans.
                Built for wholesale and white-label partners — customize the leather,
                hardware, lining, and branding to match your line.
              </p>

              {/* Specs */}
              {product.specs.length > 0 && (
                <div className="mt-8 rounded-2xl bg-stone/40 p-6">
                  <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                    Specifications
                  </h2>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {product.specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-2.5 text-sm text-charcoal/70">
                        <PiCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/#quote" className="btn-premium group justify-center">
                  <span>Request a Quote</span>
                  <span className="btn-premium-icon">
                    <PiArrowRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link href="/products" className="btn-secondary-premium justify-center">
                  <span>Browse More</span>
                </Link>
              </div>

              <p className="mt-4 text-xs text-charcoal/40">
                Wholesale pricing provided on request. Minimum order quantities apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-padding">
          <div className="container-custom px-4 md:px-8">
            <h2 className="reveal mb-10 font-heading text-3xl text-charcoal md:text-4xl">
              You might also like
            </h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
              {related.map((p, i) => (
                <div
                  key={p.id}
                  className="reveal"
                  style={{ animationDelay: `${Math.min(i * 60, 240)}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
