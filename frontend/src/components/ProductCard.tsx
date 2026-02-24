import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import type { Product } from '../backend';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function formatPrice(paise: bigint): string {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const inStock = product.stockQuantity > 0n;

  return (
    <Card className="group flex flex-col overflow-hidden border border-border shadow-card hover:shadow-warm transition-all duration-200 bg-card rounded-lg">
      <div className="relative overflow-hidden bg-muted aspect-[4/3]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/generated/shop-logo.dim_256x256.png';
          }}
        />
        {!inStock && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full font-body uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
        {inStock && product.stockQuantity <= 5n && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="text-xs font-body">
              Only {String(product.stockQuantity)} left
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="font-heading font-semibold text-base text-foreground leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-lg text-primary">
            {formatPrice(product.price)}
          </span>
          {inStock ? (
            <span className="flex items-center gap-1 text-xs font-body text-green-700 font-semibold">
              <Package size={12} />
              In Stock
            </span>
          ) : (
            <span className="text-xs font-body text-destructive font-semibold">Out of Stock</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold text-sm gap-2 disabled:opacity-50"
          disabled={!inStock}
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart size={15} />
          {inStock ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
}
