import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCatalogFilters } from '../../hooks/catalog/useCatalogFilters';
import { useAllProducts } from '../../hooks/catalog/useCatalog';

export function FiltersPanel() {
  const { data: products = [] } = useAllProducts();
  const { filters, updateFilter } = useCatalogFilters(products);

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];

  const maxPrice = Math.max(...products.map(p => Number(p.price)), 10000);
  const priceRange = filters.priceRange || [0, maxPrice];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Filters</h3>

      <Accordion type="multiple" defaultValue={['category', 'brand', 'price', 'availability']} className="w-full">
        {/* Category */}
        {categories.length > 0 && (
          <AccordionItem value="category">
            <AccordionTrigger className="text-sm">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories?.includes(category)}
                      onCheckedChange={(checked) => {
                        const current = filters.categories || [];
                        updateFilter('categories', 
                          checked 
                            ? [...current, category]
                            : current.filter(c => c !== category)
                        );
                      }}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Brand */}
        {brands.length > 0 && (
          <AccordionItem value="brand">
            <AccordionTrigger className="text-sm">Brand</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={filters.brands?.includes(brand)}
                      onCheckedChange={(checked) => {
                        const current = filters.brands || [];
                        updateFilter('brands',
                          checked
                            ? [...current, brand]
                            : current.filter(b => b !== brand)
                        );
                      }}
                    />
                    <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm">Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={0}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={(value) => updateFilter('priceRange', value)}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${(priceRange[0] / 100).toFixed(0)}</span>
                <span>${(priceRange[1] / 100).toFixed(0)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStockOnly}
                onCheckedChange={(checked) => updateFilter('inStockOnly', checked as boolean)}
              />
              <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                In stock only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
