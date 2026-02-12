import { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/admin/useAdminData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Product } from '../../backend';

interface ProductEditorProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductEditor({ product, onClose }: ProductEditorProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  
  const [formData, setFormData] = useState({
    id: product?.id || `prod-${Date.now()}`,
    name: product?.name || '',
    description: product?.description || '',
    price: product ? Number(product.price) / 100 : 0,
    category: product?.category || '',
    brand: product?.brand || '',
    inventory: product ? Number(product.inventory) : 0,
    imageId: product?.imageId || ''
  });

  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track changes
  useEffect(() => {
    const hasChanges = 
      formData.name !== (product?.name || '') ||
      formData.description !== (product?.description || '') ||
      formData.price !== (product ? Number(product.price) / 100 : 0) ||
      formData.category !== (product?.category || '') ||
      formData.brand !== (product?.brand || '') ||
      formData.inventory !== (product ? Number(product.inventory) : 0) ||
      formData.imageId !== (product?.imageId || '');
    
    setIsDirty(hasChanges);
  }, [formData, product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (formData.inventory < 0) {
      newErrors.inventory = 'Inventory cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const productData: Product = {
      id: formData.id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: BigInt(Math.round(formData.price * 100)),
      category: formData.category.trim(),
      brand: formData.brand.trim() || undefined,
      inventory: BigInt(formData.inventory),
      imageId: formData.imageId.trim() || undefined
    };

    try {
      if (product) {
        await updateProduct.mutateAsync(productData);
        toast.success('Product updated');
      } else {
        await createProduct.mutateAsync(productData);
        toast.success('Product created');
      }
      setIsDirty(false);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowUnsavedDialog(false);
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className={errors.price ? 'border-destructive' : ''}
            />
            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory">Inventory *</Label>
            <Input
              id="inventory"
              type="number"
              min="0"
              value={formData.inventory}
              onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) || 0 })}
              className={errors.inventory ? 'border-destructive' : ''}
            />
            {errors.inventory && <p className="text-sm text-destructive">{errors.inventory}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={errors.category ? 'border-destructive' : ''}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageId">Image URL</Label>
          <Input
            id="imageId"
            value={formData.imageId}
            onChange={(e) => setFormData({ ...formData, imageId: e.target.value })}
            placeholder="Optional image URL"
          />
          {/* Image Preview */}
          <div className="mt-2">
            <img
              src={formData.imageId || '/assets/generated/product-placeholder-set-1.dim_1200x1200.png'}
              alt="Product preview"
              className="w-32 h-32 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.src = '/assets/generated/product-placeholder-set-1.dim_1200x1200.png';
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
            {createProduct.isPending || updateProduct.isPending ? 'Saving...' : 'Save Product'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
