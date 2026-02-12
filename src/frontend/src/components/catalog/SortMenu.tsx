import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCatalogFilters } from '../../hooks/catalog/useCatalogFilters';
import { useAllProducts } from '../../hooks/catalog/useCatalog';

export function SortMenu() {
  const { data: products = [] } = useAllProducts();
  const { filters, updateFilter } = useCatalogFilters(products);

  return (
    <Select value={filters.sortBy || 'relevance'} onValueChange={(value) => updateFilter('sortBy', value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">Relevance</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="name">Name</SelectItem>
      </SelectContent>
    </Select>
  );
}
