import { useParams, Link } from '@tanstack/react-router';
import { useOrder } from '../hooks/orders/useOrder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { StatusTimeline } from '../components/orders/StatusTimeline';

export function OrderConfirmationPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded mx-auto" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-light mb-4">Order not found</h2>
        <Button asChild>
          <Link to="/">Return to store</Link>
        </Button>
      </div>
    );
  }

  const total = (Number(order.totalAmount) / 100).toFixed(2);

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h1 className="text-3xl font-light">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-normal">Order #{order.id}</CardTitle>
              <Badge>{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <StatusTimeline order={order} />

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} × {item.quantity.toString()}
                    </span>
                    <span>${((Number(item.price) * Number(item.quantity)) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Shipping Details</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>{order.contactEmail}</p>
                {order.contactPhone && <p>{order.contactPhone}</p>}
                <p className="whitespace-pre-line">{order.shippingAddress}</p>
                <p className="capitalize">{order.deliveryMethod} delivery</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to="/">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link to="/account/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
