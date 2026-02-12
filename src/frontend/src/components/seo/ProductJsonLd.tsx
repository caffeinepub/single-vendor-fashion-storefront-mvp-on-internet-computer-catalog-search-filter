import type { Product } from '../../backend';

interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const price = (Number(product.price) / 100).toFixed(2);
  const isInStock = Number(product.inventory) > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand
    } : undefined,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'USD',
      availability: isInStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: typeof window !== 'undefined' ? window.location.href : ''
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
