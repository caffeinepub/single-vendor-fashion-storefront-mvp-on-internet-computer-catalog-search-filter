import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { CartItem } from '../../backend';

const GUEST_CART_KEY = 'guestCart';

function getGuestCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setGuestCart(cart: CartItem[]) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save guest cart:', error);
  }
}

export function useCart() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<CartItem[]>({
    queryKey: ['cart', isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated && actor) {
        return actor.getCart();
      }
      return getGuestCart();
    },
    enabled: !!actor && !actorFetching
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async ({ productId, quantity, variantId }: { productId: string; quantity: bigint; variantId: string | null }) => {
      if (isAuthenticated && actor) {
        await actor.addToCart(productId, quantity, variantId);
      } else {
        const cart = getGuestCart();
        const product = await actor?.getProduct(productId);
        if (product) {
          cart.push({ product, quantity, variantId: variantId || undefined });
          setGuestCart(cart);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: bigint }) => {
      if (isAuthenticated && actor) {
        await actor.updateCartItem(productId, quantity);
      } else {
        const cart = getGuestCart();
        const updatedCart = cart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0n);
        setGuestCart(updatedCart);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated && actor) {
        await actor.removeFromCart(productId);
      } else {
        const cart = getGuestCart();
        setGuestCart(cart.filter(item => item.product.id !== productId));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  return useMutation({
    mutationFn: async () => {
      if (isAuthenticated && actor) {
        await actor.clearCart();
      } else {
        setGuestCart([]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });
}
