import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Product } from '../../backend';
import { fuzzyMatch } from '../../utils/search/fuzzy';

export function useSearch(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      
      try {
        // Try backend search first
        const results = await actor.searchProducts(searchTerm);
        return results;
      } catch {
        // Fallback to client-side fuzzy search
        const allProducts = await actor.getAllProducts();
        return allProducts.filter(product => 
          fuzzyMatch(searchTerm, product.name) || 
          fuzzyMatch(searchTerm, product.description)
        );
      }
    },
    enabled: !!actor && !actorFetching && searchTerm.trim().length > 0,
    staleTime: 30000
  });
}
