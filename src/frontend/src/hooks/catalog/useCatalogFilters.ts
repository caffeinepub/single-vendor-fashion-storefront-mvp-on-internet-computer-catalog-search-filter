import { useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type { Product } from '../../backend';

interface Filters {
  categories?: string[];
  brands?: string[];
  priceRange?: [number, number];
  inStockOnly?: boolean;
  sortBy?: string;
}

export function useCatalogFilters(products: Product[]) {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as any;

  const filters: Filters = useMemo(() => {
    return {
      categories: searchParams.categories ? searchParams.categories.split(',') : undefined,
      brands: searchParams.brands ? searchParams.brands.split(',') : undefined,
      priceRange: searchParams.minPrice && searchParams.maxPrice 
        ? [Number(searchParams.minPrice), Number(searchParams.maxPrice)]
        : undefined,
      inStockOnly: searchParams.inStock === 'true',
      sortBy: searchParams.sort || 'relevance'
    };
  }, [searchParams]);

  const updateFilter = (key: keyof Filters, value: any) => {
    const newParams: any = { ...searchParams };

    if (key === 'categories') {
      newParams.categories = value.length > 0 ? value.join(',') : undefined;
    } else if (key === 'brands') {
      newParams.brands = value.length > 0 ? value.join(',') : undefined;
    } else if (key === 'priceRange') {
      newParams.minPrice = value[0];
      newParams.maxPrice = value[1];
    } else if (key === 'inStockOnly') {
      newParams.inStock = value ? 'true' : undefined;
    } else if (key === 'sortBy') {
      newParams.sort = value !== 'relevance' ? value : undefined;
    }

    navigate({ search: newParams as any });
  };

  const clearFilters = () => {
    navigate({ search: undefined as any });
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(p => filters.categories!.includes(p.category));
    }

    if (filters.brands && filters.brands.length > 0) {
      result = result.filter(p => p.brand && filters.brands!.includes(p.brand));
    }

    if (filters.priceRange) {
      result = result.filter(p => {
        const price = Number(p.price);
        return price >= filters.priceRange![0] && price <= filters.priceRange![1];
      });
    }

    if (filters.inStockOnly) {
      result = result.filter(p => Number(p.inventory) > 0);
    }

    // Sort
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, filters]);

  const hasActiveFilters = !!(
    (filters.categories && filters.categories.length > 0) ||
    (filters.brands && filters.brands.length > 0) ||
    filters.priceRange ||
    filters.inStockOnly
  );

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredProducts,
    hasActiveFilters
  };
}
