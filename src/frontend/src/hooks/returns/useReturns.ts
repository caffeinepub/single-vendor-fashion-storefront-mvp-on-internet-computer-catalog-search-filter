import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { ReturnRequest } from '../../backend';

export function useReturnRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReturnRequest[]>({
    queryKey: ['returnRequests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getReturnRequests();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching
  });
}

export function useInitiateReturn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.initiateReturn(orderId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returnRequests'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    }
  });
}
