import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Menu, X, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartDrawer from './CartDrawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary shadow-warm border-b-2 border-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-secondary flex-shrink-0 bg-cream-100">
                <img
                  src="/assets/generated/shop-logo.dim_256x256.png"
                  alt="Maa Gayatri Stationers Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-primary-foreground text-lg md:text-xl font-bold leading-tight tracking-wide">
                  Maa Gayatri
                </span>
                <span className="font-heading text-secondary text-xs md:text-sm font-semibold tracking-widest uppercase">
                  Stationers
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-primary-foreground/80 hover:text-secondary font-body font-semibold text-sm tracking-wide transition-colors"
              >
                Catalogue
              </Link>
              <Link
                to="/admin/orders"
                className="text-primary-foreground/80 hover:text-secondary font-body font-semibold text-sm tracking-wide transition-colors flex items-center gap-1"
              >
                <Package size={15} />
                Admin Orders
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-primary-foreground hover:bg-primary/80 hover:text-secondary"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary text-secondary-foreground border-0 font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary-foreground hover:bg-primary/80"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-primary-foreground/20 py-3 space-y-1">
              <Link
                to="/"
                className="block px-2 py-2 text-primary-foreground/80 hover:text-secondary font-body font-semibold text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catalogue
              </Link>
              <Link
                to="/admin/orders"
                className="block px-2 py-2 text-primary-foreground/80 hover:text-secondary font-body font-semibold text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Orders
              </Link>
              <button
                className="block w-full text-left px-2 py-2 text-primary-foreground/80 hover:text-secondary font-body font-semibold text-sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: '/checkout' });
                }}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
