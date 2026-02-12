import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Product, Variant, Bundle } from '../../backend';

export function useAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useProduct(productId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor || !productId) return null;
      try {
        return await actor.getProduct(productId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!productId
  });
}

export function useVariant(variantId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Variant | null>({
    queryKey: ['variant', variantId],
    queryFn: async () => {
      if (!actor || !variantId) return null;
      try {
        return await actor.getVariant(variantId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!variantId
  });
}
