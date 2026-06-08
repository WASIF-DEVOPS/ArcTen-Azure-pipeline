'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

import {
  PiBuildings,
  PiUsersThree,
  PiScissors,
  PiDesktop,
  PiSealCheck,
  PiPackage,
  PiGlobe,
  PiRecycle,
  PiSun,
  PiArrowRight,
} from 'react-icons/pi';

export default function ManufacturingPage() {
  const containerRef = useScrollReveal();

  const processSteps = [
    {
      number: '01',
      title: 'Material Selection',
      description:
        'We source only the finest full-grain leather from certified tanneries in Italy, Argentina, and New Zealand. Each hide is hand-inspected for quality, texture, and consistency.',
      details: ['Full-grain & top-grain options', 'Vegetable & chrome tanning', 'Custom color matching', 'Sustainable sourcing'],
    },
    {
      number: '02',
      title: 'Pattern & Cutting',
      description:
        'Master pattern makers create precise templates using CAD technology. Our cutting specialists maximize material efficiency while ensuring each piece meets exact specifications.',
      details: ['CAD precision patterns', 'Laser-guided cutting', 'Zero-waste optimization', 'Quality grading system'],
    },
    {
      number: '03',
      title: 'Craftsmanship',
      description:
        'Skilled artisans with 10+ years of experience hand-stitch, edge-finish, and assemble each piece. Traditional techniques meet modern precision.',
      details: ['Hand-stitched seams', 'Burnished edges', 'Custom hardware fitting', 'Reinforced stress points'],
    },
    {
      number: '04',
      title: 'Quality Control',
      description:
        'Every item undergoes a 47-point inspection process. We test durability, finish quality, hardware function, and overall aesthetics before approval.',
      details: ['47-point inspection', 'Stress testing', 'Color consistency check', 'Final polish & conditioning'],
    },
    {
      number: '05',
      title: 'Packaging & Delivery',
      description:
        'Products are carefully packaged in premium materials with your branding. We offer global shipping with real-time tracking and insurance.',
      details: ['Custom branded packaging', 'Dust bags & boxes', 'Global logistics network', 'Real-time tracking'],
    },
  ];

  const facilities = [
    { label: 'Production Floor', value: '50,000 sq ft', icon: <PiBuildings className="h-5 w-5" /> },
    { label: 'Master Craftsmen', value: '120+', icon: <PiUsersThree className="h-5 w-5" /> },
    { label: 'Cutting Tables', value: '24', icon: <PiScissors className="h-5 w-5" /> },
    { label: 'Sewing Stations', value: '80', icon: <PiDesktop className="h-5 w-5" /> },
    { label: 'QC Inspectors', value: '15', icon: <PiSealCheck className="h-5 w-5" /> },
    { label: 'Daily Capacity', value: '500 units', icon: <PiPackage className="h-5 w-5" /> },
  ];

  return (
    <div ref={containerRef}>
      {/* Hero — full-bleed image */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32">
        <Image
          src="/products/sheriff-brown-suede-2.jpg"
          alt="ARCTen leather manufacturing"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%]"
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
              The Craft
            </span>
            <h1 className="reveal stagger-1 mt-6 font-heading text-5xl md:text-7xl text-cream leading-[0.9] text-balance">
              Where tradition
              <span className="block text-accent">meets precision</span>
            </h1>
            <p className="reveal stagger-2 mt-6 max-w-xl text-lg md:text-xl leading-relaxed text-cream/70">
              Step inside our facility, where 120+ master craftsmen transform premium
              leather into exceptional products.
            </p>

            <div className="reveal stagger-3 mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cream/15 pt-6 text-sm text-cream/65">
              <span>50,000 sq ft Facility</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>120+ Artisans</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>ISO 9001 Certified</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-cream/40 md:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
          <span className="h-12 w-px bg-gradient-to-b from-cream/50 to-transparent" />
        </div>
      </section>

      {/* Facility Stats */}
      {/* <section className="border-b border-charcoal/5 bg-stone/30 py-16">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
            {facilities.map((stat, i) => (
              <div key={stat.label} className={`reveal stagger-${Math.min(i + 1, 5)} text-center`}>
                <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {stat.icon}
                </span>
                <p className="font-heading text-2xl text-charcoal md:text-3xl tabular-nums">{stat.value}</p>
                <p className="mt-1 text-xs text-charcoal/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Process Steps */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="mb-16 max-w-2xl">
            <span className="reveal eyebrow mb-4 inline-block">The Process</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal leading-[0.95]">
              Five steps to excellence
            </h2>
          </div>

          <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
            {processSteps.map((step, i) => (
              <div key={step.number} className={`reveal stagger-${Math.min(i + 1, 5)} py-10`}>
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-2">
                    <span className="font-heading text-6xl text-accent/25 md:text-7xl">{step.number}</span>
                  </div>
                  <div className="lg:col-span-6">
                    <h3 className="font-heading text-2xl text-charcoal md:text-3xl">{step.title}</h3>
                    <p className="mt-4 leading-relaxed text-charcoal/60">{step.description}</p>
                  </div>
                  <div className="lg:col-span-4">
                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3 text-charcoal/70">
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-stone/30">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal">
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <Image
                  src="/products/legacy-black-biker-2.jpg"
                  alt="Quality craftsmanship at ARCTen"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <span className="reveal eyebrow mb-6 inline-block">Certifications</span>
              <h2 className="reveal stagger-1 font-heading text-4xl md:text-5xl text-charcoal leading-tight">
                Quality you can trust
              </h2>
              <p className="reveal stagger-2 mt-6 text-lg leading-relaxed text-charcoal/60">
                Our facility meets the highest international standards for quality
                management, environmental responsibility, and ethical manufacturing.
              </p>
              <div className="reveal stagger-3 mt-10 grid grid-cols-2 gap-x-10 gap-y-8">
                {[
                  { cert: 'ISO 9001:2015', desc: 'Quality Management' },
                  { cert: 'ISO 14001', desc: 'Environmental' },
                  { cert: 'OEKO-TEX', desc: 'Safe Materials' },
                  { cert: 'LWG Gold', desc: 'Leather Working Group' },
                ].map((item) => (
                  <div key={item.cert} className="border-t border-charcoal/10 pt-4">
                    <p className="font-heading text-xl text-charcoal">{item.cert}</p>
                    <p className="mt-1 text-sm text-charcoal/50">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="section-padding bg-charcoal text-cream">
        <div className="container-custom px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="reveal eyebrow mb-6 inline-block bg-accent/20 text-accent">Sustainability</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-5xl">
              Crafted responsibly
            </h2>
            <p className="reveal stagger-2 mx-auto mt-6 mb-12 max-w-2xl text-lg leading-relaxed text-cream/60">
              We&apos;re committed to sustainable practices across our supply chain. From
              responsibly sourced leather to zero-waste cutting, we minimize our footprint
              without compromising quality.
            </p>

            <div className="reveal stagger-3 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { icon: <PiGlobe className="h-7 w-7" />, title: 'Responsible Sourcing', desc: 'LWG-certified tanneries only.' },
                { icon: <PiRecycle className="h-7 w-7" />, title: 'Zero Waste', desc: '98% material utilization rate.' },
                { icon: <PiSun className="h-7 w-7" />, title: 'Clean Energy', desc: '60% solar-powered facility.' },
              ].map((item) => (
                <div key={item.title} className="border-t border-cream/10 pt-6 text-left">
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                    {item.icon}
                  </span>
                  <h3 className="font-heading text-xl text-cream">{item.title}</h3>
                  <p className="mt-2 text-sm text-cream/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8 text-center">
          <h2 className="reveal font-heading text-4xl md:text-5xl text-charcoal mb-6">
            Ready to see it in action?
          </h2>
          <p className="reveal stagger-1 mx-auto mb-10 max-w-xl text-charcoal/60">
            Schedule a virtual tour of our facility or request samples to experience our
            craftsmanship firsthand.
          </p>
          <div className="reveal stagger-2 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/#quote" className="btn-premium group">
              <span>Request Samples</span>
              <span className="btn-premium-icon">
                <PiArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link href="/products" className="btn-secondary-premium">
              <span>View Products</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
