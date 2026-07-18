'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PiArrowUpRight } from 'react-icons/pi';
import type { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article>
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-opacity duration-700 ease-out-expo ${
              hovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <Image
            src={product.hoverImage}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-[1200ms] ease-out-expo ${
              hovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
            }`}
          />

          {/* color tag */}
          {product.color && (
            <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-charcoal backdrop-blur">
              {product.color}
            </span>
          )}

          {/* hover action */}
          <span
            className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-cream transition-all duration-500 ease-out-expo ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <PiArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {/* Meta */}
        <div className="mt-4 px-0.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/40">
            {product.style}
          </p>
          <h3 className="mt-1 font-heading text-lg leading-snug text-charcoal transition-colors duration-300 group-hover:text-accent">
            {product.name}
          </h3>
        </div>
      </article>
    </Link>
  );
}
