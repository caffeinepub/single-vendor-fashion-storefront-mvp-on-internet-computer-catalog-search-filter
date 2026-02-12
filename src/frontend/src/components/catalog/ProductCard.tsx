import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../../backend';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = (Number(product.price) / 100).toFixed(2);
  const isOutOfStock = Number(product.inventory) === 0;

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <Card className="group overflow-hidden border-0 shadow-none hover:shadow-soft transition-shadow">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.imageId || '/assets/generated/product-placeholder-set-1.dim_1200x1200.png'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            {product.brand && (
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            <h3 className="font-normal text-base line-clamp-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              <p className="font-medium">${price}</p>
              {isOutOfStock && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
