import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Package, Truck, CheckCircle } from 'lucide-react';
import type { Order } from '../backend';
import { OrderStatus } from '../backend';
import { useUpdateOrderStatus } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface OrderRowProps {
  order: Order;
  productNames: Record<string, string>;
}

function formatPrice(paise: bigint): string {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  [OrderStatus.pending]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: <Clock size={12} />,
  },
  [OrderStatus.processing]: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <Package size={12} />,
  },
  [OrderStatus.dispatched]: {
    label: 'Dispatched',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: <Truck size={12} />,
  },
  [OrderStatus.delivered]: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: <CheckCircle size={12} />,
  },
};

export default function OrderRow({ order, productNames }: OrderRowProps) {
  const [open, setOpen] = useState(false);
  const updateStatus = useUpdateOrderStatus();
  const statusConfig = STATUS_CONFIG[order.status];

  const handleStatusChange = (value: string) => {
    updateStatus.mutate({ orderId: order.orderId, newStatus: value as OrderStatus });
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        {/* Order Header */}
        <CollapsibleTrigger asChild>
          <button className="w-full text-left p-4 hover:bg-muted/30 transition-colors">
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-bold text-foreground text-sm">
                    Order #{String(order.orderId)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-body font-semibold px-2 py-0.5 rounded-full border ${statusConfig.color}`}
                  >
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                </div>
                <p className="font-body text-sm text-foreground mt-0.5 font-semibold">
                  {order.customerName}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {order.phone} · {formatDate(order.timestamp)}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-heading font-bold text-primary text-base">
                  {formatPrice(order.totalAmount)}
                </span>
                {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </div>
            </div>
          </button>
        </CollapsibleTrigger>

        {/* Expanded Details */}
        <CollapsibleContent>
          <div className="border-t border-border px-4 py-4 space-y-4 bg-muted/20">
            {/* Address */}
            <div>
              <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Delivery Address
              </p>
              <p className="font-body text-sm text-foreground">{order.address}</p>
            </div>

            {/* Items */}
            <div>
              <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Items Ordered
              </p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-body bg-card rounded-md px-3 py-2 border border-border">
                    <span className="text-foreground font-semibold">
                      {productNames[String(item.productId)] || `Product #${String(item.productId)}`}
                    </span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>×{String(item.quantity)}</span>
                      <span className="font-bold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update */}
            <div className="flex items-center gap-3">
              <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Update Status:
              </p>
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={updateStatus.isPending}
              >
                <SelectTrigger className="w-44 h-8 text-sm font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderStatus.pending} className="font-body text-sm">Pending</SelectItem>
                  <SelectItem value={OrderStatus.processing} className="font-body text-sm">Processing</SelectItem>
                  <SelectItem value={OrderStatus.dispatched} className="font-body text-sm">Dispatched</SelectItem>
                  <SelectItem value={OrderStatus.delivered} className="font-body text-sm">Delivered</SelectItem>
                </SelectContent>
              </Select>
              {updateStatus.isPending && (
                <span className="text-xs text-muted-foreground font-body animate-pulse">Updating…</span>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
