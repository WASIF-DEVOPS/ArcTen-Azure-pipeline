'use client';

import Link from 'next/link';
import Image from 'next/image';
import QuoteForm from '@/components/QuoteForm';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import jacketImg from '@/assets/jacket.png';
import bagImg from '@/assets/bag.png';

// Phosphor Icons - Ultra-light, premium look
import { 
  PiSealCheck, 
  PiChartLineUp, 
  PiTag, 
  PiTruck,
  PiArrowRight,
  PiArrowUpRight
} from 'react-icons/pi';

export default function Home() {
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden pt-24 pb-16">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container-custom px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal">
              <span className="eyebrow mb-6 inline-block">Est. 2009 · 500+ Brands Served</span>
            </div>
            
            <h1 className="reveal stagger-1 font-heading text-5xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-[0.95]">
              Premium Leather
              <span className="block text-accent">Manufacturing</span>
            </h1>
            
            <p className="reveal stagger-2 text-charcoal/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              From custom leather jackets to bespoke bags — ARCTen delivers exceptional 
              craftsmanship for brands that demand excellence.
            </p>
            
            <div className="reveal stagger-3 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#quote" className="btn-premium text-base group">
                <span>Request a Wholesale Quote</span>
                <span className="btn-premium-icon">
                  <PiArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/manufacturing" className="btn-secondary-premium text-base">
                <span>See Our Process</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-charcoal/30">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-charcoal/30 to-transparent" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 border-y border-charcoal/5">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { number: '500+', label: 'Brands Served' },
              { number: '15+', label: 'Years Excellence' },
              { number: '50K+', label: 'Units Annually' },
              { number: 'ISO 9001', label: 'Certified' },
            ].map((stat, i) => (
              <div key={stat.label} className={`reveal stagger-${i + 1} text-center`}>
                <p className="font-heading text-3xl md:text-4xl text-charcoal mb-1">{stat.number}</p>
                <p className="text-charcoal/40 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
q
      {/* Value Proposition - Bento Grid */}
      {/* <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="reveal eyebrow mb-4 inline-block">Why ARCTen</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal">
              Crafted for Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="reveal md:col-span-8 card-shell">
              <div className="card-inner p-8 md:p-12 h-full">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <PiSealCheck className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl md:text-3xl text-charcoal mb-4">Uncompromising Quality</h3>
                <p className="text-charcoal/60 leading-relaxed max-w-lg">
                  Full-grain leather sourced from the finest tanneries, precision stitching by master craftsmen, 
                  and rigorous quality control on every single piece that leaves our facility.
                </p>
              </div>
            </div>

            <div className="reveal stagger-1 md:col-span-4 flex flex-col gap-4">
              <div className="card-shell flex-1">
                <div className="card-inner p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                    <PiChartLineUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl text-charcoal mb-2">Flexible MOQ</h3>
                  <p className="text-charcoal/60 text-sm">From 50 to 50,000 units. We scale with your needs.</p>
                </div>
              </div>
              <div className="card-shell flex-1">
                <div className="card-inner p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                    <PiTag className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl text-charcoal mb-2">White-Label Ready</h3>
                  <p className="text-charcoal/60 text-sm">Your brand, our craftsmanship. Complete customization.</p>
                </div>
              </div>
            </div>

            <div className="reveal stagger-2 md:col-span-4 card-shell">
              <div className="card-inner p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <PiTruck className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl text-charcoal mb-2">On-Time Delivery</h3>
                <p className="text-charcoal/60 text-sm">98.7% on-time delivery rate. Your deadlines are our priority.</p>
              </div>
            </div>

            <div className="reveal stagger-3 md:col-span-8 card-shell bg-charcoal/5">
              <div className="card-inner bg-charcoal p-8 md:p-12 h-full flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-heading text-2xl text-cream mb-2">Ready to Partner?</h3>
                  <p className="text-cream/60">Join 500+ brands who trust ARCTen.</p>
                </div>
                <Link href="#quote" className="btn-premium bg-accent text-charcoal hover:bg-cream shrink-0 group">
                  <span>Get Started</span>
                  <span className="btn-premium-icon bg-charcoal/10">
                    <PiArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Products Preview */}
      <section className="section-padding bg-stone/30">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="reveal eyebrow mb-4 inline-block">Our Craft</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal mb-4">
              Product Lines
            </h2>
            <p className="reveal stagger-2 text-charcoal/60 max-w-xl mx-auto">
              Premium leather goods designed for wholesale and white-label partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { img: jacketImg, title: 'Leather Jackets', desc: 'Bomber, biker, blazer, and custom styles.' },
              { img: bagImg, title: 'Leather Bags', desc: 'Totes, duffels, briefcases, and accessories.' },
            ].map((product, i) => (
              <div key={product.title} className={`reveal stagger-${i + 1} group`}>
                <div className="image-shell">
                  <div className="image-inner relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-heading text-3xl text-cream mb-2">{product.title}</h3>
                      <p className="text-cream/70 mb-4">{product.desc}</p>
                      <Link 
                        href="/gallery" 
                        className="inline-flex items-center gap-2 text-accent font-medium 
                                 transition-all duration-300 group-hover:gap-3"
                      >
                        <span>View Collection</span>
                        <PiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-charcoal text-cream">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="reveal eyebrow bg-accent/20 text-accent mb-4 inline-block">The Process</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl mb-4">
              From Concept to Delivery
            </h2>
            <p className="reveal stagger-2 text-cream/50 max-w-xl mx-auto">
              Three simple steps to bring your vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: '01', title: 'Consultation', desc: 'Share your vision and requirements. We guide you through materials and customization.' },
              { step: '02', title: 'Sampling', desc: 'Receive physical samples for approval. Iterate until perfection.' },
              { step: '03', title: 'Production', desc: 'Full-scale manufacturing with rigorous QC. Global shipping with tracking.' },
            ].map((item, i) => (
              <div key={item.step} className={`reveal stagger-${i + 1} text-center md:text-left`}>
                <span className="font-heading text-6xl text-accent/30">{item.step}</span>
                <h3 className="font-heading text-2xl mt-4 mb-3">{item.title}</h3>
                <p className="text-cream/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal stagger-4 text-center mt-16">
            <Link href="/manufacturing" className="btn-premium bg-cream text-charcoal hover:bg-accent group">
              <span>See Full Process</span>
              <span className="btn-premium-icon bg-charcoal/10">
                <PiArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote" className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
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
