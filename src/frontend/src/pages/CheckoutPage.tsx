import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../hooks/cart/useCart';
import { usePlaceOrder } from '../hooks/orders/usePlaceOrder';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: cart = [] } = useCart();
  const placeOrder = usePlaceOrder();

  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.product.price) * Number(item.quantity);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please log in to place an order');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderId = await placeOrder.mutateAsync({
        shippingAddress,
        contactEmail,
        contactPhone: contactPhone || null,
        deliveryMethod
      });
      
      toast.success('Order placed successfully!');
      navigate({ to: '/order/$orderId', params: { orderId } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-light mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate({ to: '/' })}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-8">
            <h2 className="text-2xl font-light mb-4">Please log in</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to place an order
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-light mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-normal">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-normal">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    rows={4}
                    placeholder="Street address, city, state, postal code, country"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-normal">Delivery Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Shipping (5-7 days)</SelectItem>
                    <SelectItem value="express">Express Shipping (2-3 days)</SelectItem>
                    <SelectItem value="overnight">Overnight Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl font-normal">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity.toString()}
                      </span>
                      <span>
                        ${((Number(item.product.price) * Number(item.quantity)) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={placeOrder.isPending}
                >
                  {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
