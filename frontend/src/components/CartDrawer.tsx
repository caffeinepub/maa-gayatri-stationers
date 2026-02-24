import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function formatPrice(paise: bigint): string {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalAmount, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate({ to: '/checkout' });
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 bg-cream-100">
        <SheetHeader className="px-6 py-4 bg-primary text-primary-foreground">
          <SheetTitle className="font-heading text-primary-foreground text-xl flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={56} className="text-muted-foreground opacity-40" />
            <p className="font-heading text-xl text-foreground/60">Your cart is empty</p>
            <p className="font-body text-sm text-muted-foreground">
              Browse our catalogue and add items to get started.
            </p>
            <SheetClose asChild>
              <Button variant="default" className="mt-2">
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={String(item.product.id)} className="flex gap-3 bg-card rounded-lg p-3 shadow-card border border-border">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/generated/shop-logo.dim_256x256.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground truncate">
                        {item.product.name}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {formatPrice(item.product.price)} each
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border border-border rounded-md overflow-hidden">
                          <button
                            className="px-2 py-1 hover:bg-muted transition-colors text-foreground"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 py-1 text-xs font-bold font-body min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 hover:bg-muted transition-colors text-foreground"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-body font-bold text-sm text-secondary-foreground">
                            {formatPrice(item.product.price * BigInt(item.quantity))}
                          </span>
                          <button
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            onClick={() => removeItem(item.product.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 py-4 bg-card border-t border-border">
              <div className="flex justify-between items-center mb-3">
                <span className="font-body font-semibold text-foreground">Total Amount</span>
                <span className="font-heading font-bold text-xl text-primary">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <Separator className="mb-3" />
              <Button
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading font-semibold text-base"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
