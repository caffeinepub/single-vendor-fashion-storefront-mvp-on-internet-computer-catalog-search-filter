import { Link } from '@tanstack/react-router';
import { useOrderHistory } from '../../hooks/orders/useOrder';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export function OrdersPage() {
  const { data: orders = [], isLoading } = useOrderHistory();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-light mb-8">Order History</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <Package className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-light">No orders yet</h2>
            <p className="text-muted-foreground">Start shopping to see your orders here</p>
            <Button asChild>
              <Link to="/">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const total = (Number(order.totalAmount) / 100).toFixed(2);
            const date = new Date(Number(order.createdAt) / 1000000);
            
            return (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <Badge>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="font-medium">${total}</p>
                    </div>
                    <Button asChild variant="outline">
                      <Link to="/account/orders/$orderId" params={{ orderId: order.id }}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
