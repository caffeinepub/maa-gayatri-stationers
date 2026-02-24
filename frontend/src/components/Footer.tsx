import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'maa-gayatri-stationers');

  return (
    <footer className="bg-primary text-primary-foreground border-t-2 border-secondary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary bg-cream-100">
                <img
                  src="/assets/generated/shop-logo.dim_256x256.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-heading font-bold text-primary-foreground leading-tight">Maa Gayatri</p>
                <p className="font-heading text-secondary text-xs tracking-widest uppercase">Stationers</p>
              </div>
            </div>
            <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
              Your trusted neighborhood stationery shop. Quality products for school, office, and art.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-secondary mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/70">
              <li><a href="/" className="hover:text-secondary transition-colors">Product Catalogue</a></li>
              <li><a href="/checkout" className="hover:text-secondary transition-colors">Checkout</a></li>
              <li><a href="/admin/orders" className="hover:text-secondary transition-colors">Admin Orders</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-secondary mb-3 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="font-body text-sm text-primary-foreground/70 space-y-1">
              <p>📍 Your Local Stationery Shop</p>
              <p>🕐 Mon–Sat: 9 AM – 8 PM</p>
              <p>📞 Ask in store for details</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body text-primary-foreground/60">
          <p>© {year} Maa Gayatri Stationers. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-secondary fill-secondary" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
