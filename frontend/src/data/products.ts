import rawProducts from './products.json';

export type ProductCategory = 'jackets' | 'bags';
export type ProductGender = 'men' | 'women' | null;

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  gender: ProductGender;
  style: string;
  color: string;
  image: string;
  hoverImage: string;
  specs: string[];
}

export const products: Product[] = rawProducts as Product[];

export type ProductFilter = 'all' | 'men' | 'women' | 'bags';

export const filters: { key: ProductFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'men', label: "Men's Jackets" },
  { key: 'women', label: "Women's Jackets" },
  { key: 'bags', label: 'Leather Bags' },
];

export function filterProducts(filter: ProductFilter): Product[] {
  switch (filter) {
    case 'men':
      return products.filter((p) => p.category === 'jackets' && p.gender === 'men');
    case 'women':
      return products.filter((p) => p.category === 'jackets' && p.gender === 'women');
    case 'bags':
      return products.filter((p) => p.category === 'bags');
    default:
      return products;
  }
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.slug !== product.slug &&
        p.category === product.category &&
        (product.category === 'bags' || p.gender === product.gender)
    )
    .slice(0, count);
}
