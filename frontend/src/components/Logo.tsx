'use client';

import Image from 'next/image';
import logoImage from '@/assets/images/new-logo.png';

interface LogoProps {
  className?: string;
  color?: string;
}

export default function Logo({ className = '', color }: LogoProps) {
  const isLightVariant = color === '#FDFBF7' || color === '#FFFFFF' || color === 'white';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={logoImage}
        alt="ARCTen Logo"
        width={36}
        height={36}
        className={isLightVariant ? 'brightness-0 invert' : ''}
        priority
      />
      <span className={`font-heading text-xl tracking-wide ${isLightVariant ? 'text-cream' : 'text-charcoal'}`}>
        <span className="font-semibold">ARC</span>
        <span className="text-secondary font-normal">Ten</span>
      </span>
    </div>
  );
}
