import { useState, useEffect } from 'react';
import { useUpdateInventory } from '../../hooks/admin/useAdminData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Product } from '../../backend';

interface InventoryEditorProps {
  product: Product;
}

export function InventoryEditor({ product }: InventoryEditorProps) {
  const [open, setOpen] = useState(false);
  const [inventory, setInventory] = useState(Number(product.inventory));
  const updateInventory = useUpdateInventory();

  // Reset inventory when dialog opens or product changes
  useEffect(() => {
    if (open) {
      setInventory(Number(product.inventory));
    }
  }, [open, product.inventory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inventory < 0) {
      toast.error('Inventory cannot be negative');
      return;
    }

    try {
      await updateInventory.mutateAsync({
        productId: product.id,
        inventory: BigInt(inventory)
      });
      toast.success('Inventory updated');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update inventory');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product</Label>
            <Input
              id="product-name"
              value={product.name}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventory">Stock Quantity *</Label>
            <Input
              id="inventory"
              type="number"
              min="0"
              value={inventory}
              onChange={(e) => setInventory(parseInt(e.target.value) || 0)}
              required
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Current stock: {product.inventory.toString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={updateInventory.isPending}>
              {updateInventory.isPending ? 'Updating...' : 'Update'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
