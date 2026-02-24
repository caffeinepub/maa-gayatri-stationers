import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Category } from '../backend';
import type { Product } from '../backend';
import { useAllProducts, useSeedProducts } from '../hooks/useQueries';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.writing]: 'Writing',
  [Category.paper]: 'Paper',
  [Category.artSupplies]: 'Art Supplies',
  [Category.officeEssentials]: 'Office Essentials',
  [Category.schoolSupplies]: 'School Supplies',
};

const ALL_CATEGORIES = [
  Category.writing,
  Category.paper,
  Category.artSupplies,
  Category.officeEssentials,
  Category.schoolSupplies,
];

function ProductGrid({ products, onAddToCart }: { products: Product[]; onAddToCart: (p: Product) => void }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground font-body">
        <p className="text-lg">No products found in this category.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={String(product.id)} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

function ProductSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden border border-border bg-card shadow-card">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <div className="px-4 pb-4">
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry, isRetrying }: { onRetry: () => void; isRetrying: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
          Unable to load products
        </h3>
        <p className="font-body text-muted-foreground text-sm max-w-xs">
          Something went wrong while fetching the catalogue. Please try again.
        </p>
      </div>
      <Button
        onClick={onRetry}
        disabled={isRetrying}
        variant="outline"
        className="gap-2 font-body border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        {isRetrying ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <RefreshCw size={16} />
        )}
        {isRetrying ? 'Retrying…' : 'Try Again'}
      </Button>
    </div>
  );
}

export default function CatalogPage() {
  const { data: products, isLoading, isError, isFetching, refetch, status } = useAllProducts();
  const { addItem } = useCart();
  const seedMutation = useSeedProducts();
  const [activeTab, setActiveTab] = useState<string>('all');
  const seedAttempted = useRef(false);

  // Auto-seed if no products found after a successful fetch
  useEffect(() => {
    if (
      status === 'success' &&
      !isFetching &&
      products !== undefined &&
      products.length === 0 &&
      !seedAttempted.current &&
      !seedMutation.isPending
    ) {
      seedAttempted.current = true;
      seedMutation.mutate(undefined, {
        onError: () => {
          seedAttempted.current = false;
        },
      });
    }
  }, [status, isFetching, products, seedMutation]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      description: `₹${(Number(product.price) / 100).toFixed(2)}`,
      duration: 2000,
    });
  };

  const handleRetry = () => {
    seedAttempted.current = false;
    refetch();
  };

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    if (activeTab === 'all') return products;
    return products.filter((p) => p.category === activeTab);
  }, [products, activeTab]);

  const showLoading = isLoading || seedMutation.isPending;

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: '400px' }}>
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Maa Gayatri Stationers – Quality Stationery"
          className="w-full object-cover"
          style={{ maxHeight: '400px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground leading-tight drop-shadow-lg">
              Maa Gayatri
              <br />
              <span className="text-secondary">Stationers</span>
            </h1>
            <p className="font-body text-primary-foreground/90 mt-2 text-sm md:text-base max-w-xs">
              Quality stationery for school, office & art
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Our Products
          </h2>
          {(seedMutation.isPending || (isFetching && !isLoading)) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
              <Loader2 size={14} className="animate-spin" />
              {seedMutation.isPending ? 'Loading catalogue…' : 'Refreshing…'}
            </div>
          )}
        </div>

        {isError ? (
          <ErrorState onRetry={handleRetry} isRetrying={isFetching} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="overflow-x-auto pb-2 mb-6">
              <TabsList className="bg-muted border border-border h-auto p-1 gap-1 flex-nowrap inline-flex">
                <TabsTrigger
                  value="all"
                  className="font-body font-semibold text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  All Products
                </TabsTrigger>
                {ALL_CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="font-body font-semibold text-sm whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {CATEGORY_LABELS[cat]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab}>
              {showLoading ? (
                <ProductSkeletons />
              ) : (
                <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </section>
    </div>
  );
}
