import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { usePlaceOrder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CheckoutFormData {
  customerName: string;
  phone: string;
  address: string;
}

function formatPrice(paise: bigint): string {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const placeOrderMutation = usePlaceOrder();
  const [orderPlaced, setOrderPlaced] = useState<{ orderId: bigint } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground opacity-40 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="font-body text-muted-foreground mb-6">Add some products before checking out.</p>
        <Button onClick={() => navigate({ to: '/' })} className="gap-2">
          <ArrowLeft size={16} />
          Back to Catalogue
        </Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-card rounded-2xl border border-border shadow-warm p-8">
          <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
          <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Order Placed!</h2>
          <p className="font-body text-muted-foreground mb-4">
            Thank you for shopping with Maa Gayatri Stationers.
          </p>
          <div className="bg-muted rounded-lg px-6 py-4 mb-6 border border-border">
            <p className="font-body text-sm text-muted-foreground">Order ID</p>
            <p className="font-heading text-2xl font-bold text-primary">
              #{String(orderPlaced.orderId)}
            </p>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-6">
            We'll process your order shortly. Please keep your Order ID for reference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate({ to: '/admin/orders' })}
            >
              View Orders
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground"
              onClick={() => navigate({ to: '/' })}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    const orderItems = items.map((item) => ({
      productId: item.product.id,
      quantity: BigInt(item.quantity),
      price: item.product.price,
    }));

    try {
      const order = await placeOrderMutation.mutateAsync({
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        items: orderItems,
        totalAmount,
      });
      clearCart();
      setOrderPlaced({ orderId: order.orderId });
    } catch {
      // error handled by mutation state
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Catalogue
      </button>

      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card className="border border-border shadow-card bg-card">
          <CardHeader className="bg-muted/50 rounded-t-lg border-b border-border">
            <CardTitle className="font-heading text-lg text-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={String(item.product.id)} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border flex-shrink-0">
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
                    <p className="font-body font-semibold text-sm text-foreground truncate">
                      {item.product.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {formatPrice(item.product.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-body font-bold text-sm text-foreground flex-shrink-0">
                    {formatPrice(item.product.price * BigInt(item.quantity))}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="font-body font-semibold text-foreground">Total</span>
              <span className="font-heading font-bold text-xl text-primary">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Form */}
        <Card className="border border-border shadow-card bg-card">
          <CardHeader className="bg-muted/50 rounded-t-lg border-b border-border">
            <CardTitle className="font-heading text-lg text-foreground">Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="customerName" className="font-body font-semibold text-sm">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerName"
                  placeholder="Enter your full name"
                  className="font-body"
                  {...register('customerName', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
                {errors.customerName && (
                  <p className="text-destructive text-xs font-body">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-body font-semibold text-sm">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="font-body"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Enter a valid 10-digit Indian mobile number',
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-destructive text-xs font-body">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="font-body font-semibold text-sm">
                  Delivery Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full delivery address"
                  className="font-body resize-none"
                  rows={3}
                  {...register('address', {
                    required: 'Address is required',
                    minLength: { value: 10, message: 'Please enter a complete address' },
                  })}
                />
                {errors.address && (
                  <p className="text-destructive text-xs font-body">{errors.address.message}</p>
                )}
              </div>

              {placeOrderMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription className="font-body text-sm">
                    Failed to place order. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold text-base h-11 gap-2"
                disabled={placeOrderMutation.isPending}
              >
                {placeOrderMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Place Order · {formatPrice(totalAmount)}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
