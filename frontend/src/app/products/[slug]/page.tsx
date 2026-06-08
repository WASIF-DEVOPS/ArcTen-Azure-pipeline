import { notFound } from 'next/navigation';
import { products, getProduct } from '@/data/products';
import ProductDetail from './ProductDetail';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) return { title: 'Product Not Found | ARCTen' };
  return {
    title: `${product.name} | ARCTen`,
    description: `${product.name} — premium ${product.style.toLowerCase()} manufactured by ARCTen. Available for wholesale and white-label production.`,
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
