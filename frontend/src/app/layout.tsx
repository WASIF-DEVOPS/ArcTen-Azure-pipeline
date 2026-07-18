import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: 'ARCTen | Premium Leather Manufacturing',
  description: 'High-end custom leather jackets and bags for wholesale, white-labeling, and corporate gifting. 15+ years of craftsmanship excellence.',
  keywords: 'leather manufacturing, wholesale leather jackets, custom leather bags, white label leather, corporate gifting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-charcoal">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
