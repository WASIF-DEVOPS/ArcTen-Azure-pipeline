import Link from 'next/link';
import Logo from './Logo';
import { PiLinkedinLogo, PiFacebookLogo, PiPhone, PiArrowRight } from 'react-icons/pi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/80">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Logo className="h-10 w-auto mb-6" color="#FDFBF7" />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Premium leather manufacturing for brands that demand excellence. 
              15+ years of craftsmanship, serving 500+ global partners.
            </p>
            
            {/* Request Quote Button */}
            <Link 
              href="/#quote" 
              className="inline-flex items-center gap-3 bg-accent text-charcoal font-medium 
                       px-5 py-3 rounded-full transition-all duration-500 ease-out
                       hover:bg-cream active:scale-[0.98] group mb-6"
            >
              <span>Request a Quote</span>
              <span className="w-7 h-7 rounded-full bg-charcoal/10 flex items-center justify-center
                             transition-all duration-500 ease-out
                             group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                <PiArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-accent mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Products', href: '/products' },
                { label: 'Manufacturing', href: '/manufacturing' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-accent mb-6">Products</h4>
            <ul className="space-y-3">
              {[
                { label: 'Leather Jackets', href: '/products?c=men' },
                { label: 'Leather Bags', href: '/products?c=bags' },
                { label: 'Custom Orders', href: '/#quote' },
                { label: 'White Label', href: '/#quote' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-white/50 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-accent mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-white/50">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <PiPhone className="w-4 h-4 text-accent" />
                </span>
                <a href="tel:+923003363449" className="hover:text-white transition-colors duration-300">
                  +92 300 336 3449
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <PiLinkedinLogo className="w-4 h-4 text-accent" />
                </span>
                <a 
                  href="https://www.linkedin.com/company/arcten-leather/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300"
                >
                  ARCTen on LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <PiFacebookLogo className="w-4 h-4 text-accent" />
                </span>
                <a 
                  href="https://www.facebook.com/arctenleather" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-300"
                >
                  ARCTen on Facebook
                </a>
              </li>
            </ul>
            
            {/* Connect with Founder */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.15em] text-accent mb-3">Connect with Founder</p>
              <div className="flex gap-2">
                <a 
                  href="https://www.linkedin.com/in/kamranarctenleather" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/50 text-xs
                           hover:bg-accent hover:text-charcoal transition-all duration-500 ease-out"
                >
                  <PiLinkedinLogo className="w-3.5 h-3.5" />
                  <span>Kamran</span>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61572368833338" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/50 text-xs
                           hover:bg-accent hover:text-charcoal transition-all duration-500 ease-out"
                >
                  <PiFacebookLogo className="w-3.5 h-3.5" />
                  <span>Kamran</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8 w-full">
          <p className="text-white/30 text-xs text-center w-full ">
            © {currentYear} ARCTen Leather Manufacturing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
