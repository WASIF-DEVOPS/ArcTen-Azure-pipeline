// One-off scraper: pulls real product data + images from the reference Shopify
// store and generates ARCTen's local product catalog. Run with: node scripts/fetch-products.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_IMG = path.join(__dirname, '..', 'public', 'products');
const OUT_DATA = path.join(__dirname, '..', 'src', 'data');

fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_DATA, { recursive: true });

const SOURCES = {
  men: 'https://www.thejacketmaker.pk/collections/mens-leather-jackets/products.json',
  women: 'https://www.thejacketmaker.pk/collections/womens-leather-jackets/products.json',
  bags: 'https://www.thejacketmaker.pk/collections/leather-bags/products.json',
};

// Curated handles we want to feature (keeps the catalog tight and on-brand).
const SELECT = {
  men: [
    'dean-brown-leather-biker-jacket',
    'inferno-black-leather-jacket',
    'ionic-black-leather-jacket',
    'sheriff-brown-suede-jacket',
    'legacy-black-leather-biker-jacket',
    'allaric-alley-black-leather-biker-jacket',
    'blain-dark-brown-suede-bomber-jacket',
    'air-rolf-brown-leather-bomber-jacket',
    'bravado-black-hooded-leather-bomber-jacket',
    'mystical-black-leather-jacket',
    'evan-hart-fur-brown-leather-jacket',
    'andy-matte-black-hooded-leather-jacket',
  ],
  women: [
    'flashback-black-leather-biker-jacket',
    'bliss-black-leather-bomber-jacket',
    'kelsee-blue-leather-biker-jacket',
    'zenna-black-leather-bomber-jacket',
    'vixen-black-classic-collar-leather-jacket',
    'elixir-black-collarless-leather-jacket',
    'westa-a-2-green-leather-bomber-jacket',
    'selina-black-leather-blazer',
    'rumy-distressed-brown-leather-biker-jacket',
    'elixir-pink-collarless-leather-jacket',
    'carolyn-quilted-black-biker-jacket',
    'rumella-green-suede-biker-jacket',
  ],
  bags: [
    'the-norman-vintage-tan-leather-briefcase',
    'the-carismatico-black-leather-messenger-bag',
    'the-captain-midnight-blue-leather-briefcase',
    'the-philos-black-leather-backpack',
    'the-poet-black-leather-tote-bag',
    'the-carismatico-vintage-brown-leather-messenger-bag',
    'the-captain-brown-leather-briefcase',
    'the-darrio-vintage-brown-leather-duffle-bag',
    'the-philos-vintage-brown-leather-backpack',
    'the-dale-vintage-brown-leather-duffle-bag',
    'the-baxter-vintage-brown-leather-laptop-sleeve',
    'the-eclectic-black-leather-folio-organizer',
  ],
};

// Strip HTML list into clean spec strings.
function parseSpecs(html) {
  if (!html) return [];
  const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
  );
  return items.filter(Boolean).slice(0, 10);
}

// ARCTen is a manufacturer; rewrite name to drop the source brand's "The" naming
// quirks and keep it clean.
function cleanName(title) {
  return title.replace(/^The\s+/i, '').trim();
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function extOf(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  return ext === '.webp' ? '.webp' : '.jpg';
}

const catalog = [];

for (const [key, url] of Object.entries(SOURCES)) {
  const res = await fetch(url);
  const json = await res.json();
  const byHandle = new Map(json.products.map((p) => [p.handle, p]));

  for (const handle of SELECT[key]) {
    const p = byHandle.get(handle);
    if (!p) {
      console.warn(`MISSING: ${key} / ${handle}`);
      continue;
    }
    const imgs = (p.images || []).map((i) => i.src).slice(0, 2);
    if (imgs.length < 1) {
      console.warn(`NO IMAGES: ${handle}`);
      continue;
    }

    const slug = handle.replace(/^the-/, '').replace(/-leather|-jacket|-bag/g, '').replace(/--+/g, '-');
    const files = [];
    for (let i = 0; i < imgs.length; i++) {
      const ext = extOf(imgs[i]);
      const fname = `${slug}-${i + 1}${ext}`;
      await download(imgs[i], path.join(OUT_IMG, fname));
      files.push(`/products/${fname}`);
      console.log(`downloaded ${fname}`);
    }

    const tags = (p.tags || []).map((t) => t.toLowerCase());
    const colorTag = tags.find((t) =>
      ['black', 'brown', 'blue', 'green', 'pink', 'tan', 'grey', 'gray'].includes(t)
    );

    catalog.push({
      id: slug,
      slug,
      name: cleanName(p.title),
      category: key === 'bags' ? 'bags' : 'jackets',
      gender: key === 'bags' ? null : key, // men | women | null
      style: p.product_type || (key === 'bags' ? 'Leather Bag' : 'Jacket'),
      color: colorTag ? colorTag[0].toUpperCase() + colorTag.slice(1) : '',
      image: files[0],
      hoverImage: files[1] || files[0],
      specs: parseSpecs(p.body_html),
    });
  }
}

fs.writeFileSync(
  path.join(OUT_DATA, 'products.json'),
  JSON.stringify(catalog, null, 2)
);
console.log(`\nWrote ${catalog.length} products to src/data/products.json`);
