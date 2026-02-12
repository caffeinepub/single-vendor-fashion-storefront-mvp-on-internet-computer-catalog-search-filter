import { Badge } from '@/components/ui/badge';
import type { Order, OrderStatus } from '../../backend';

interface StatusTimelineProps {
  order: Order;
}

const statusLabels: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  paid: 'Payment Confirmed',
  fulfilled: 'Order Fulfilled',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  refunded: 'Refunded'
};

export function StatusTimeline({ order }: StatusTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Order Status</h3>
      <div className="space-y-3">
        {order.statusHistory.map(([status, timestamp], index) => {
          const date = new Date(Number(timestamp) / 1000000);
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{statusLabels[status]}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
