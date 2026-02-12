import { useNavigate } from '@tanstack/react-router';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '../hooks/cart/useCart';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartLineItem } from '../components/cart/CartLineItem';
import { RecommendationsRow } from '../components/recommendations/RecommendationsRow';
import { ShoppingBag } from 'lucide-react';

export function CartPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cart = [], isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0);

  const handleCheckout = () => {
    if (!identity) {
      // Guest checkout allowed
      navigate({ to: '/checkout' });
    } else {
      navigate({ to: '/checkout' });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-16 text-center space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-light">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some products to get started</p>
            <Button onClick={() => navigate({ to: '/' })}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-light mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartLineItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={(quantity) => 
                updateItem.mutate({ productId: item.product.id, quantity: BigInt(quantity) })
              }
              onRemove={() => removeItem.mutate(item.product.id)}
            />
          ))}
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl font-normal">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <RecommendationsRow />
      </div>
    </div>
  );
}
