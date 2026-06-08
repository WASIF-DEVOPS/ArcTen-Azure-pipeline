'use client';

import Link from 'next/link';
import Image from 'next/image';
import QuoteForm from '@/components/QuoteForm';
import { useScrollReveal } from '@/hooks/useScrollReveal';

// Phosphor Icons - Ultra-light, premium look
import {
  PiSealCheck,
  PiChartLineUp,
  PiTag,
  PiTruck,
  PiArrowRight,
  PiArrowUpRight,
} from 'react-icons/pi';

export default function Home() {
  const containerRef = useScrollReveal();

  const categories = [
    {
      title: "Men's Leather Jackets",
      desc: 'Bikers, bombers, racers, and coats in full-grain hides.',
      img: '/products/inferno-black-1.jpg',
      href: '/products?c=men',
    },
    {
      title: "Women's Leather Jackets",
      desc: 'Moto, blazer, and collarless silhouettes, tailored to fit.',
      img: '/products/flashback-black-biker-1.jpg',
      href: '/products?c=women',
    },
    {
      title: 'Leather Bags',
      desc: 'Totes, duffels, briefcases, and backpacks built to last.',
      img: '/products/carismatico-vintage-brown-messenger-1.webp',
      href: '/products?c=bags',
    },
  ];

  return (
    <div ref={containerRef}>
      {/* Hero — full-bleed editorial */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32">
        <Image
          src="/products/inferno-black-2.jpg"
          alt="Premium leather jacket crafted by ARCTen"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_25%]"
        />
        {/* readability gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/10 to-transparent" />
        {/* grain */}
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
              Est. 2009 · 500+ Brands Served
            </span>
            <h1 className="reveal stagger-1 mt-6 font-heading text-5xl md:text-7xl lg:text-8xl text-cream leading-[0.9] text-balance">
              Premium Leather
              <span className="block text-accent">Manufacturing</span>
            </h1>
            <p className="reveal stagger-2 mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-cream/70">
              From custom leather jackets to bespoke bags — ARCTen delivers exceptional
              craftsmanship for brands that demand excellence.
            </p>
            <div className="reveal stagger-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="#quote" className="btn-premium group bg-accent text-charcoal hover:bg-cream">
                <span>Request a Wholesale Quote</span>
                <span className="btn-premium-icon bg-charcoal/10">
                  <PiArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <Link
                href="/products"
                className="btn-secondary-premium border-cream/30 text-cream hover:bg-cream hover:text-charcoal"
              >
                <span>Explore the Collection</span>
              </Link>
            </div>

            {/* meta strip */}
            <div className="reveal stagger-4 mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cream/15 pt-6 text-sm text-cream/65">
              <span>Custom Manufacturing</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Wholesale &amp; White-Label</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Shipped to 40+ Countries</span>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="pointer-events-none absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-cream/40 md:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
          <span className="h-12 w-px bg-gradient-to-b from-cream/50 to-transparent" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 border-b border-charcoal/5">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
            {[
              { number: '500+', label: 'Brands Served' },
              { number: '15+', label: 'Years Excellence' },
              { number: '50K+', label: 'Units Annually' },
              { number: 'ISO 9001', label: 'Certified' },
            ].map((stat, i) => (
              <div key={stat.label} className={`reveal stagger-${i + 1} text-center`}>
                <p className="font-heading text-3xl md:text-4xl text-charcoal mb-1 tabular-nums">
                  {stat.number}
                </p>
                <p className="text-sm text-charcoal/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase — three image-led cards */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="reveal eyebrow mb-4 inline-block">Our Craft</span>
              <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal leading-[0.95]">
                Built across three lines
              </h2>
            </div>
            <p className="reveal stagger-2 max-w-sm text-charcoal/60">
              Every style is a foundation. Choose the leather, hardware, lining, and
              branding to make it your own.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.title}
                href={cat.href}
                className={`reveal stagger-${i + 1} group block`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-stone/40">
                  <Image
                    src={cat.img}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <h3 className="font-heading text-2xl text-cream md:text-3xl">{cat.title}</h3>
                    <p className="mt-2 max-w-xs text-sm text-cream/70">{cat.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-all duration-300 group-hover:gap-3">
                      <span>View Collection</span>
                      <PiArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why ARCTen — editorial split with imagery */}
      <section className="section-padding bg-stone/30">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal order-2 lg:order-1">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src="/products/sheriff-brown-suede-1.jpg"
                  alt="ARCTen craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="reveal eyebrow mb-4 inline-block">Why ARCTen</span>
              <h2 className="reveal stagger-1 font-heading text-4xl md:text-5xl text-charcoal leading-tight">
                Crafted for the brands that get noticed
              </h2>
              <p className="reveal stagger-2 mt-6 max-w-md leading-relaxed text-charcoal/60">
                Full-grain leather from the finest tanneries, precision stitching by
                master craftsmen, and rigorous quality control on every piece that
                leaves our facility.
              </p>

              <div className="reveal stagger-3 mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                {[
                  { icon: <PiSealCheck className="h-6 w-6" />, title: 'Uncompromising Quality', desc: 'Inspected at every stage.' },
                  { icon: <PiChartLineUp className="h-6 w-6" />, title: 'Flexible MOQ', desc: 'From 50 to 50,000 units.' },
                  { icon: <PiTag className="h-6 w-6" />, title: 'White-Label Ready', desc: 'Your brand, our craft.' },
                  { icon: <PiTruck className="h-6 w-6" />, title: 'On-Time Delivery', desc: '98.7% on-time rate.' },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      {f.icon}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg text-charcoal">{f.title}</h3>
                      <p className="mt-1 text-sm text-charcoal/55">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-charcoal text-cream">
        <div className="container-custom px-4 md:px-8">
          <div className="mb-16 text-center">
            <span className="reveal eyebrow mb-4 inline-block bg-accent/20 text-accent">The Process</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl">
              From concept to delivery
            </h2>
            <p className="reveal stagger-2 mx-auto mt-4 max-w-xl text-cream/50">
              Three simple steps to bring your vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
            {[
              { step: '01', title: 'Consultation', desc: 'Share your vision and requirements. We guide you through materials and customization.' },
              { step: '02', title: 'Sampling', desc: 'Receive physical samples for approval. Iterate until perfection.' },
              { step: '03', title: 'Production', desc: 'Full-scale manufacturing with rigorous QC. Global shipping with tracking.' },
            ].map((item, i) => (
              <div key={item.step} className={`reveal stagger-${i + 1} border-t border-cream/10 pt-6`}>
                <span className="font-heading text-6xl text-accent/30">{item.step}</span>
                <h3 className="mt-4 mb-3 font-heading text-2xl">{item.title}</h3>
                <p className="leading-relaxed text-cream/50">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal stagger-4 mt-16 text-center">
            <Link href="/manufacturing" className="btn-premium group bg-cream text-charcoal hover:bg-accent">
              <span>See Full Process</span>
              <span className="btn-premium-icon bg-charcoal/10">
                <PiArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote" className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <span className="reveal eyebrow mb-4 inline-block">Let&apos;s Talk</span>
              <h2 className="reveal stagger-1 font-heading text-4xl md:text-5xl text-charcoal mb-4">
                Request a Quote
              </h2>
              <p className="reveal stagger-2 text-charcoal/60">
                Tell us about your project. We respond within 24 hours.
              </p>
            </div>

            <div className="reveal stagger-3 card-shell">
              <div className="card-inner p-8 md:p-12">
                <QuoteForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
