import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Category, OrderItem, OrderStatus } from '../backend';

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.getAllProducts();
      return result ?? [];
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 2000,
  });
}

export function useProductsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.getProductsByCategory(category);
      return result ?? [];
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 2000,
  });
}

export function useOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.getOrders();
      return result ?? [];
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
    retry: 1,
    retryDelay: 2000,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      phone,
      address,
      items,
      totalAmount,
    }: {
      customerName: string;
      phone: string;
      address: string;
      items: OrderItem[];
      totalAmount: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.placeOrder(customerName, phone, address, items, totalAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: bigint; newStatus: OrderStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateOrderStatus(orderId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useSeedProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.seedProducts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
