import { useState, useMemo } from 'react';
import { useAllProducts } from '../../hooks/catalog/useCatalog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductEditor } from '../../components/admin/ProductEditor';
import { InventoryEditor } from '../../components/admin/InventoryEditor';
import { Plus, Search } from 'lucide-react';
import type { Product } from '../../backend';

type SortOption = 'name-asc' | 'name-desc' | 'inventory-asc' | 'inventory-desc' | 'price-asc' | 'price-desc';

export function AdminProductsPage() {
  const { data: products = [], isLoading } = useAllProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = products.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(term);
        const brandMatch = product.brand?.toLowerCase().includes(term);
        const categoryMatch = product.category.toLowerCase().includes(term);
        return nameMatch || brandMatch || categoryMatch;
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'inventory-asc':
          return Number(a.inventory) - Number(b.inventory);
        case 'inventory-desc':
          return Number(b.inventory) - Number(a.inventory);
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, sortBy]);

  const handleCloseEditor = () => {
    setShowCreate(false);
    setEditingProduct(null);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-light">Product Management</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="inventory-asc">Stock (Low-High)</SelectItem>
            <SelectItem value="inventory-desc">Stock (High-Low)</SelectItem>
            <SelectItem value="price-asc">Price (Low-High)</SelectItem>
            <SelectItem value="price-desc">Price (High-Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products List */}
      {filteredAndSortedProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            {searchTerm ? 'No products match your search.' : 'No products yet. Add your first product to get started.'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={product.imageId || '/assets/generated/product-placeholder-set-1.dim_1200x1200.png'}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span>Price: ${(Number(product.price) / 100).toFixed(2)}</span>
                      <span>Category: {product.category}</span>
                      <span className={Number(product.inventory) < 10 ? 'text-destructive font-medium' : ''}>
                        Stock: {product.inventory.toString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                      Edit
                    </Button>
                    <InventoryEditor product={product} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Editor Dialog */}
      <Dialog open={showCreate || !!editingProduct} onOpenChange={(open) => {
        if (!open) handleCloseEditor();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductEditor
            product={editingProduct}
            onClose={handleCloseEditor}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
