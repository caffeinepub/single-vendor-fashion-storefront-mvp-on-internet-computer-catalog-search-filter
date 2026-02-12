import { useAllOrders, useUpdateOrderStatus } from '../../hooks/admin/useAdminData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderStatus } from '../../backend';
import { toast } from 'sonner';

export function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus });
      toast.success('Order status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

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

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-light mb-8">Order Management</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const total = (Number(order.totalAmount) / 100).toFixed(2);
            const date = new Date(Number(order.createdAt) / 1000000);

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-normal">Order #{order.id}</CardTitle>
                    <Badge>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p>{order.customer.toString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p>{date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">${total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p>{order.items.length}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Update Status</p>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
