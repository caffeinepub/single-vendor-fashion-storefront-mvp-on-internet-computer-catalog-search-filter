import { useAllProducts } from '../hooks/catalog/useCatalog';
import { ProductCard } from '../components/catalog/ProductCard';
import { FiltersPanel } from '../components/catalog/FiltersPanel';
import { SortMenu } from '../components/catalog/SortMenu';
import { useCatalogFilters } from '../hooks/catalog/useCatalogFilters';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CatalogPage() {
  const { data: products = [], isLoading } = useAllProducts();
  const { filteredProducts, hasActiveFilters, clearFilters } = useCatalogFilters(products);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[40vh] md:h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1600x900.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
        <div className="relative container h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">
              Spring Collection
            </h1>
            <p className="text-lg md:text-xl font-light">
              Discover timeless pieces for your wardrobe
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <FiltersPanel />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                )}
              </div>
              <SortMenu />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No products found matching your filters.</p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
