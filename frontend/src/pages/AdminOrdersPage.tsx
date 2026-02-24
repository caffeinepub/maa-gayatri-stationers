import React, { useMemo } from 'react';
import { Package, RefreshCw, ClipboardList } from 'lucide-react';
import { useOrders, useAllProducts } from '../hooks/useQueries';
import OrderRow from '../components/OrderRow';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '../backend';

export default function AdminOrdersPage() {
  const { data: orders, isLoading, isError, refetch, isFetching } = useOrders();
  const { data: products } = useAllProducts();

  const productNames = useMemo(() => {
    const map: Record<string, string> = {};
    if (products) {
      products.forEach((p) => {
        map[String(p.id)] = p.name;
      });
    }
    return map;
  }, [products]);

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [orders]);

  const statusCounts = useMemo(() => {
    if (!orders) return {};
    return orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [orders]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
            <ClipboardList size={28} className="text-primary" />
            Admin Orders
          </h1>
          <p className="font-body text-muted-foreground text-sm mt-1">
            Manage and update order statuses
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 font-body"
        >
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      {orders && orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { status: OrderStatus.pending, label: 'Pending', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
            { status: OrderStatus.processing, label: 'Processing', color: 'bg-blue-50 border-blue-200 text-blue-800' },
            { status: OrderStatus.dispatched, label: 'Dispatched', color: 'bg-orange-50 border-orange-200 text-orange-800' },
            { status: OrderStatus.delivered, label: 'Delivered', color: 'bg-green-50 border-green-200 text-green-800' },
          ].map(({ status, label, color }) => (
            <div key={status} className={`rounded-lg border p-3 text-center ${color}`}>
              <p className="font-heading font-bold text-2xl">{statusCounts[status] || 0}</p>
              <p className="font-body text-xs font-semibold uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="font-body">
            Failed to load orders. Please try refreshing.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-muted-foreground opacity-30 mb-4" />
          <h3 className="font-heading text-xl font-semibold text-foreground/60 mb-2">No orders yet</h3>
          <p className="font-body text-muted-foreground text-sm">
            Orders placed by customers will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-body text-sm text-muted-foreground mb-2">
            {sortedOrders.length} order{sortedOrders.length !== 1 ? 's' : ''} total
          </p>
          {sortedOrders.map((order) => (
            <OrderRow key={String(order.orderId)} order={order} productNames={productNames} />
          ))}
        </div>
      )}
    </div>
  );
}
