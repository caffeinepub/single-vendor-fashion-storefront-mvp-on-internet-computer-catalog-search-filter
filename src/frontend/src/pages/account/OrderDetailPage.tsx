import { useParams, Link } from '@tanstack/react-router';
import { useOrder } from '../../hooks/orders/useOrder';
import { useReturnRequests } from '../../hooks/returns/useReturns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusTimeline } from '../../components/orders/StatusTimeline';
import { InitiateReturnForm } from '../../components/orders/InitiateReturnForm';
import { ArrowLeft } from 'lucide-react';

export function OrderDetailPage() {
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const { data: order, isLoading } = useOrder(orderId);
  const { data: returnRequests = [] } = useReturnRequests();

  const orderReturns = returnRequests.filter(r => r.orderId === orderId);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
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
          <Link to="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const total = (Number(order.totalAmount) / 100).toFixed(2);
  const canInitiateReturn = order.status === 'delivered' && orderReturns.length === 0;

  return (
    <div className="container py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/account/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto space-y-6">
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

        {/* Return Requests */}
        {orderReturns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Return Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderReturns.map((returnReq) => (
                <div key={returnReq.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Return #{returnReq.id}</span>
                    <Badge variant="outline">{returnReq.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{returnReq.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Initiate Return */}
        {canInitiateReturn && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Request Return</CardTitle>
            </CardHeader>
            <CardContent>
              <InitiateReturnForm orderId={orderId} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
