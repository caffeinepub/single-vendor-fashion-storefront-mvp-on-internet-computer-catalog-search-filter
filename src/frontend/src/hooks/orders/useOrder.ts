import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Order } from '../../backend';

export function useOrder(orderId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor || !orderId) return null;
      try {
        return await actor.getOrder(orderId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!orderId
  });
}

export function useOrderHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orderHistory'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getOrderHistory();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching
  });
}
