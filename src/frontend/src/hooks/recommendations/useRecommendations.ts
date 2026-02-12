import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Product } from '../../backend';

export function useRecommendations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['recommendations'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getRecommendations();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching
  });
}

export function useTrackProductView() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) return;
      await actor.trackProductView(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    }
  });
}
