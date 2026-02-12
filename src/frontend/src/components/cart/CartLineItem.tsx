import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { CartItem } from '../../backend';

interface CartLineItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartLineItem({ item, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const price = (Number(item.product.price) / 100).toFixed(2);
  const subtotal = ((Number(item.product.price) * Number(item.quantity)) / 100).toFixed(2);
  const maxQuantity = Math.min(Number(item.product.inventory), 10);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={item.product.imageId || '/assets/generated/product-placeholder-set-1.dim_1200x1200.png'}
            alt={item.product.name}
            className="w-24 h-24 object-cover rounded"
          />
          
          <div className="flex-1 space-y-2">
            <h3 className="font-medium">{item.product.name}</h3>
            {item.product.brand && (
              <p className="text-sm text-muted-foreground">{item.product.brand}</p>
            )}
            <p className="text-sm">${price}</p>
            
            <div className="flex items-center gap-4">
              <select
                value={Number(item.quantity)}
                onChange={(e) => onUpdateQuantity(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {[...Array(maxQuantity)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Qty: {i + 1}
                  </option>
                ))}
              </select>
              
              <Button variant="ghost" size="sm" onClick={onRemove}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-medium">${subtotal}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
