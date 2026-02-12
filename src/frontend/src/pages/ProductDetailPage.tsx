import { useParams, useNavigate } from '@tanstack/react-router';
import { useProduct } from '../hooks/catalog/useCatalog';
import { useAddToCart } from '../hooks/cart/useCart';
import { useTrackProductView } from '../hooks/recommendations/useRecommendations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProductGallery } from '../components/product/ProductGallery';
import { RecommendationsRow } from '../components/recommendations/RecommendationsRow';
import { ProductJsonLd } from '../components/seo/ProductJsonLd';
import { usePageMeta } from '../hooks/seo/usePageMeta';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId);
  const addToCart = useAddToCart();
  const trackView = useTrackProductView();
  const [quantity, setQuantity] = useState(1);

  usePageMeta(
    product ? product.name : 'Product',
    product ? product.description : ''
  );

  // Track view
  if (product && productId) {
    trackView.mutate(productId);
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-light mb-4">Product not found</h2>
        <Button onClick={() => navigate({ to: '/' })}>
          Return to catalog
        </Button>
      </div>
    );
  }

  const price = (Number(product.price) / 100).toFixed(2);
  const isOutOfStock = Number(product.inventory) === 0;
  const maxQuantity = Math.min(Number(product.inventory), 10);

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(quantity),
        variantId: null
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <>
      <ProductJsonLd product={product} />
      
      <div className="container py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to catalog
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Gallery */}
          <ProductGallery product={product} />

          {/* Product Info */}
          <div className="space-y-6">
            {product.brand && (
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {product.brand}
              </p>
            )}
            
            <h1 className="text-3xl md:text-4xl font-light">{product.name}</h1>
            
            <div className="flex items-center gap-4">
              <p className="text-2xl font-medium">${price}</p>
              {isOutOfStock ? (
                <Badge variant="secondary">Out of Stock</Badge>
              ) : (
                <Badge variant="outline">{product.inventory.toString()} in stock</Badge>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={isOutOfStock}
                  className="border rounded px-3 py-2 text-sm"
                >
                  {[...Array(maxQuantity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={isOutOfStock || addToCart.isPending}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </Card>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Category: {product.category}</p>
              <p>Product ID: {product.id}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <RecommendationsRow />
        </div>
      </div>
    </>
  );
}
