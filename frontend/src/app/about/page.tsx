'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import missionImage from '@/assets/images/micah-tindell-ysu9athq_BU-unsplash.jpg';

// Phosphor Icons
import { 
  PiSealCheck, 
  PiUser, 
  PiUsersThree,
  PiArrowRight
} from 'react-icons/pi';

export default function AboutPage() {
  const containerRef = useScrollReveal();

  const team = [
    { name: 'Marcus Chen', role: 'Founder & CEO', years: '25+ years in leather' },
    { name: 'Elena Rossi', role: 'Head of Design', years: 'Former Gucci designer' },
    { name: 'James Okonkwo', role: 'Production Director', years: 'ISO 9001 specialist' },
    { name: 'Sofia Martinez', role: 'Client Relations', years: '500+ brand partnerships' },
  ];

  const milestones = [
    { year: '2009', title: 'Founded', desc: 'Started with 5 craftsmen in a small workshop' },
    { year: '2012', title: 'First Export', desc: 'Expanded to serve European fashion houses' },
    { year: '2015', title: 'ISO Certified', desc: 'Achieved ISO 9001 quality certification' },
    { year: '2018', title: '10K Units/Month', desc: 'Scaled production capacity significantly' },
    { year: '2021', title: 'Sustainability', desc: 'Launched eco-friendly leather line' },
    { year: '2024', title: '500+ Brands', desc: 'Serving global partners across 40 countries' },
  ];

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section className="min-h-[70dvh] flex items-center justify-center relative pt-32 pb-20">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container-custom px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="reveal eyebrow mb-6 inline-block">Our Story</span>
            <h1 className="reveal stagger-1 font-heading text-5xl md:text-7xl text-charcoal mb-8 leading-[0.95]">
              Crafting Excellence
              <span className="block text-accent">Since 2009</span>
            </h1>
            <p className="reveal stagger-2 text-charcoal/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              What began as a small workshop with five master craftsmen has grown into 
              a world-class manufacturing facility serving over 500 global brands.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-charcoal text-cream">
        <div className="container-custom px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="reveal eyebrow bg-accent/20 text-accent mb-6 inline-block">Our Mission</span>
              <h2 className="reveal stagger-1 font-heading text-4xl md:text-5xl mb-6">
                Empowering Brands Through Exceptional Craftsmanship
              </h2>
              <p className="reveal stagger-2 text-cream/60 text-lg leading-relaxed mb-8">
                We believe every brand deserves access to premium leather manufacturing without 
                compromising on quality, ethics, or sustainability. Our mission is to be the 
                trusted partner that transforms your vision into tangible excellence.
              </p>
              <div className="reveal stagger-3 grid grid-cols-2 gap-8">
                <div>
                  <p className="font-heading text-4xl text-accent mb-2">98.7%</p>
                  <p className="text-cream/50 text-sm">On-time delivery rate</p>
                </div>
                <div>
                  <p className="font-heading text-4xl text-accent mb-2">0.3%</p>
                  <p className="text-cream/50 text-sm">Defect rate</p>
                </div>
              </div>
            </div>
            <div className="reveal stagger-2">
              <div className="image-shell bg-white/5">
                <div className="image-inner aspect-[4/5] relative overflow-hidden">
                  <Image
                    src={missionImage}
                    alt="Leather craftsmanship at ARCTen"
                    fill
                    className="object-cover"
                    placeholder="blur"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="reveal eyebrow mb-4 inline-block">What Drives Us</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <PiSealCheck className="w-7 h-7" />,
                title: 'Uncompromising Quality', 
                desc: 'Every stitch, every cut, every finish is held to the highest standard. We never compromise on materials or craftsmanship.' 
              },
              { 
                icon: <PiUser className="w-7 h-7" />,
                title: 'Ethical Manufacturing', 
                desc: 'Fair wages, safe conditions, and sustainable practices. Our workers are artisans, not just employees.' 
              },
              { 
                icon: <PiUsersThree className="w-7 h-7" />,
                title: 'Partnership Mindset', 
                desc: 'Your success is our success. We invest in understanding your brand and becoming an extension of your team.' 
              },
            ].map((value, i) => (
              <div key={value.title} className={`reveal stagger-${i + 1} card-shell`}>
                <div className="card-inner p-8 md:p-10 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                    {value.icon}
                  </div>
                  <h3 className="font-heading text-2xl text-charcoal mb-4">{value.title}</h3>
                  <p className="text-charcoal/60 leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-stone/30">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="reveal eyebrow mb-4 inline-block">Our Journey</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal">
              15 Years of Growth
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-charcoal/10 -translate-x-1/2 hidden md:block" />
              
              {milestones.map((milestone, i) => (
                <div 
                  key={milestone.year} 
                  className={`reveal stagger-${Math.min(i + 1, 5)} relative flex flex-col md:flex-row gap-4 md:gap-8 mb-12 last:mb-0
                    ${i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''}`}
                >
                  <div className="md:w-1/2">
                    <div className={`card-shell ${i % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                      <div className="card-inner p-6">
                        <span className="font-heading text-3xl text-accent">{milestone.year}</span>
                        <h3 className="font-heading text-xl text-charcoal mt-2 mb-1">{milestone.title}</h3>
                        <p className="text-charcoal/60 text-sm">{milestone.desc}</p>
                      </div>
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 top-6 w-3 h-3 bg-accent rounded-full -translate-x-1/2 hidden md:block ring-4 ring-cream" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="reveal eyebrow mb-4 inline-block">Leadership</span>
            <h2 className="reveal stagger-1 font-heading text-4xl md:text-6xl text-charcoal">
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={member.name} className={`reveal stagger-${i + 1}`}>
                <div className="card-shell">
                  <div className="card-inner p-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                      <span className="font-heading text-2xl text-charcoal/30">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg text-charcoal">{member.name}</h3>
                    <p className="text-accent text-sm mb-1">{member.role}</p>
                    <p className="text-charcoal/40 text-xs">{member.years}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="section-padding bg-charcoal">
        <div className="container-custom px-4 md:px-8 text-center">
          <h2 className="reveal font-heading text-4xl md:text-5xl text-cream mb-6">
            Ready to Work Together?
          </h2>
          <p className="reveal stagger-1 text-cream/60 max-w-xl mx-auto mb-10">
            Join the 500+ brands who trust ARCTen for their premium leather manufacturing needs.
          </p>
          <Link href="/#quote" className="reveal stagger-2 btn-premium bg-accent text-charcoal hover:bg-cream inline-flex group">
            <span>Request a Quote</span>
            <span className="btn-premium-icon bg-charcoal/10">
              <PiArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
