'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, ShoppingCart, ClipboardList, Phone } from 'lucide-react';
import { useCart } from '@/providers/cart-provider';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Grid3X3, label: 'Products' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart', hasBadge: true },
  { href: '/track', icon: ClipboardList, label: 'Track' },
  { href: 'tel:+8801700000000', icon: Phone, label: 'Call' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : item.href.startsWith('tel')
              ? false
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              {...(item.href.startsWith('tel') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 relative transition ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`relative transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.hasBadge && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full leading-none shadow-md">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
