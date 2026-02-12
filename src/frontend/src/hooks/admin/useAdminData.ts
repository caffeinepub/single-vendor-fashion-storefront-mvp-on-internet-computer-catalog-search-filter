import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Product, Order, ReturnRequest, Analytics } from '../../backend';

export function useAnalytics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Analytics>({
    queryKey: ['analytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalytics();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useAllReturnRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReturnRequest[]>({
    queryKey: ['allReturnRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReturnRequests();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: any }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    }
  });
}

export function useProcessReturnRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ returnId, approved }: { returnId: string; approved: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.processReturnRequest(returnId, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allReturnRequests'] });
    }
  });
}

export function useCompleteRefund() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (returnId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.completeRefund(returnId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allReturnRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    }
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}

export function useUpdateInventory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, inventory }: { productId: string; inventory: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInventory(productId, inventory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
}
