import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';

interface PlaceOrderParams {
  shippingAddress: string;
  contactEmail: string;
  contactPhone: string | null;
  deliveryMethod: string;
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PlaceOrderParams) => {
      if (!actor) throw new Error('Actor not available');
      const orderId = await actor.placeOrder(
        params.shippingAddress,
        params.contactEmail,
        params.contactPhone,
        params.deliveryMethod
      );
      return orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
}
