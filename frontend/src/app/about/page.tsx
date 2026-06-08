'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';

import { PiSealCheck, PiUser, PiUsersThree, PiArrowRight } from 'react-icons/pi';

export default function AboutPage() {
  const containerRef = useScrollReveal();

  const milestones = [
    { year: '2009', title: 'Founded', desc: 'Started with 5 craftsmen in a small workshop.' },
    { year: '2012', title: 'First Export', desc: 'Expanded to serve European fashion houses.' },
    { year: '2015', title: 'ISO Certified', desc: 'Achieved ISO 9001 quality certification.' },
    { year: '2018', title: '10K Units/Month', desc: 'Scaled production capacity significantly.' },
    { year: '2021', title: 'Sustainability', desc: 'Launched eco-friendly leather line.' },
    { year: '2024', title: '500+ Brands', desc: 'Serving partners across 40 countries.' },
  ];

  return (
    <div ref={containerRef}>
      {/* Hero — editorial split */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="reveal eyebrow mb-6 inline-block">Our Story</span>
              <h1 className="reveal stagger-1 font-heading text-5xl md:text-7xl text-charcoal leading-[0.95]">
                Crafting excellence
                <span className="block text-accent">since 2009</span>
              </h1>
              <p className="reveal stagger-2 mt-6 max-w-lg text-lg leading-relaxed text-charcoal/60">
                What began as a small workshop with five master craftsmen has grown
                into a world-class manufacturing facility serving over 500 global brands.
              </p>
            </div>
            <div className="reveal stagger-2">
              <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-stone/40">
                <Image
                  src="/products/evan-hart-fur-brown-1.jpg"
                  alt="ARCTen leather craftsmanship"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-charcoal text-cream">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="reveal eyebrow mb-6 inline-block bg-accent/20 text-accent">Our Mission</span>
              <h2 className="reveal stagger-1 font-heading text-4xl md:text-5xl leading-tight">
                Empowering brands through exceptional craftsmanship
              </h2>
              <p className="reveal stagger-2 mt-6 text-lg leading-relaxed text-cream/60">
                Every brand deserves access to premium leather manufacturing without
                compromising on quality, ethics, or sustainability. We&apos;re the
                trusted partner that turns your vision into tangible excellence.
              </p>
              <div className="reveal stagger-3 mt-10 grid grid-cols-2 gap-8">
                <div>
                  <p className="font-heading text-4xl text-accent mb-2 tabular-nums">98.7%</p>
                  <p className="text-sm text-cream/50">On-time delivery rate</p>
                </div>
                <div>
                  <p className="font-heading text-4xl text-accent mb-2 tabular-nums">0.3%</p>
                  <p className="text-sm text-cream/50">Defect rate</p>
                </div>
              </div>
            </div>
            <div className="reveal stagger-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src="/products/dean-brown-biker-2.jpg"
                  alt="Leather jacket detail"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="mb-16 max-w-2xl">
            <span className="reveal eyebrow mb-4 inline-block">What drives us</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal leading-[0.95]">
              Our core values
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {[
              {
                icon: <PiSealCheck className="h-7 w-7" />,
                title: 'Uncompromising Quality',
                desc: 'Every stitch, cut, and finish is held to the highest standard. We never compromise on materials or craftsmanship.',
              },
              {
                icon: <PiUser className="h-7 w-7" />,
                title: 'Ethical Manufacturing',
                desc: 'Fair wages, safe conditions, and sustainable practices. Our workers are artisans, not just employees.',
              },
              {
                icon: <PiUsersThree className="h-7 w-7" />,
                title: 'Partnership Mindset',
                desc: 'Your success is our success. We invest in understanding your brand and become an extension of your team.',
              },
            ].map((value, i) => (
              <div key={value.title} className={`reveal stagger-${i + 1} border-t border-charcoal/10 pt-6`}>
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  {value.icon}
                </span>
                <h3 className="font-heading text-2xl text-charcoal">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/60">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-stone/30">
        <div className="container-custom px-4 md:px-8">
          <div className="mb-16 text-center">
            <span className="reveal eyebrow mb-4 inline-block">Our journey</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal">
              15 years of growth
            </h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-charcoal/10 md:left-1/2 md:block" />
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`reveal stagger-${Math.min(i + 1, 5)} relative mb-12 flex flex-col gap-4 last:mb-0 md:flex-row md:gap-8 ${
                    i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                  }`}
                >
                  <div className="md:w-1/2">
                    <div className={i % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}>
                      <div className="rounded-2xl bg-cream p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-charcoal/[0.04]">
                        <span className="font-heading text-3xl text-accent">{m.year}</span>
                        <h3 className="mt-2 mb-1 font-heading text-xl text-charcoal">{m.title}</h3>
                        <p className="text-sm text-charcoal/60">{m.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute left-0 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-stone/30 md:left-1/2 md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-charcoal">
        <div className="container-custom px-4 md:px-8 text-center">
          <h2 className="reveal font-heading text-4xl md:text-5xl text-cream mb-6">
            Ready to work together?
          </h2>
          <p className="reveal stagger-1 mx-auto mb-10 max-w-xl text-cream/60">
            Join the 500+ brands who trust ARCTen for their premium leather manufacturing.
          </p>
          <Link href="/#quote" className="reveal stagger-2 btn-premium group inline-flex bg-accent text-charcoal hover:bg-cream">
            <span>Request a Quote</span>
            <span className="btn-premium-icon bg-charcoal/10">
              <PiArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
