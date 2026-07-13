'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingCart, Menu, X, ChevronDown, Phone, MapPin, Clock, LayoutGrid } from 'lucide-react';
import { useCart } from '@/providers/cart-provider';
import { api } from '@/lib/api';
import { Category } from '@/types';

const fallbackCategories = [
  'PVC Wallpaper', 'Vinyl Wallpaper', 'Luxury Wallpaper', 'Korean Wallpaper',
  '3D Wallpaper', 'Kids Wallpaper', 'Brick Wallpaper', 'Marble Wallpaper',
  'Wood Wallpaper', 'Floral Wallpaper', 'Wall Panels', 'PVC Marble Sheets', 'Accessories',
];

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementHidden, setAnnouncementHidden] = useState(false);
  const { itemCount } = useCart();

  const { data: catData } = useQuery({
    queryKey: ['nav-categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/api/categories?isActive=true'),
    staleTime: 5 * 60 * 1000,
  });

  const apiCategories = catData?.categories || [];

  const navCategories = apiCategories.length > 0
    ? apiCategories.map((c) => ({ name: c.name, slug: c.slug }))
    : fallbackCategories.map((name) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      }));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    return () => document.body.classList.remove('body-no-scroll');
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const closeAll = useCallback(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setCategoryDropdown(false);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const catGridCols = navCategories.length <= 7 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white shadow-sm'
    }`}>
      {/* Announcement bar */}
      {!announcementHidden && (
        <div className="bg-gradient-to-r from-primary to-[#0f4a26] text-white text-xs sm:text-sm relative">
          <div className="container-custom flex items-center justify-center py-2 sm:py-2.5 gap-2 sm:gap-4">
            <span className="hidden sm:flex items-center gap-1"><Clock size={14} /> Mon-Sat: 9AM-8PM</span>
            <span className="hidden sm:block text-white/30">|</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> Free Delivery on orders over ৳2,000</span>
            <span className="hidden sm:block text-white/30">|</span>
            <a href="tel:+8801700000000" className="hidden sm:flex items-center gap-1 hover:text-primary-light transition-colors font-medium"><Phone size={14} /> +880 1700-000000</a>
            <button onClick={() => setAnnouncementHidden(true)} className="ml-2 sm:ml-4 p-0.5 hover:bg-white/10 rounded-full transition shrink-0" aria-label="Close announcement"><X size={14} /></button>
          </div>
        </div>
      )}

      {/* Main header */}
      <div className={`transition-all duration-300 ${scrolled ? 'lg:h-16' : 'lg:h-20'}`}>
        <div className="container-custom h-full">
          <div className="flex items-center justify-between h-full">
            {/* Mobile: hamburger + logo */}
            <div className="flex items-center gap-2 lg:gap-0">
              <button
                className={`lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition ${mobileMenuOpen ? 'bg-gray-100' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link href="/" className="flex items-center gap-2 shrink-0 group">
                <div className={`bg-primary rounded-lg flex items-center justify-center transition-all duration-300 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}>
                  <span className={`text-white font-bold transition-all duration-300 ${scrolled ? 'text-sm' : 'text-lg'}`}>WS</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className={`font-bold leading-tight text-primary transition-all duration-300 ${scrolled ? 'text-base' : 'text-lg'}`}>WALLSCAPE</h1>
                  <p className={`text-[10px] text-muted -mt-0.5 transition-all duration-300 ${scrolled ? 'opacity-60' : 'opacity-100'}`}>BANGLADESH</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.slice(0, 1).map((link) => (
                <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}>{link.label}</Link>
              ))}
              {/* Categories Dropdown */}
              <div className="relative" onMouseEnter={() => setCategoryDropdown(true)} onMouseLeave={() => setCategoryDropdown(false)}>
                <button
                  className={`nav-link flex items-center gap-1 cursor-pointer ${pathname.startsWith('/categories') ? 'nav-link-active' : ''}`}
                  onClick={() => setCategoryDropdown(!categoryDropdown)}
                >
                  <LayoutGrid size={15} />
                  Categories <ChevronDown size={14} className={`transition-transform duration-200 ${categoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {categoryDropdown && (
                  <>
                    <div className="fixed inset-0 top-0 z-10" onClick={() => setCategoryDropdown(false)} />
                    <div className={`absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-border py-2 min-w-[300px] z-20 animate-fadeIn ${catGridCols === 'grid-cols-2' ? 'w-[440px]' : ''}`}>
                      <div className={`grid ${catGridCols} gap-0`}>
                        {navCategories.map((cat, i) => (
                          <Link
                            key={cat.slug}
                            href={`/categories/${cat.slug}`}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-primary transition group ${
                              pathname === `/categories/${cat.slug}` ? 'text-primary bg-primary/5 font-medium' : 'text-gray-700'
                            } ${i % 2 === 0 && catGridCols === 'grid-cols-2' ? 'border-r border-gray-100' : ''}`}
                            onClick={() => setCategoryDropdown(false)}
                          >
                            <span className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition shrink-0" />
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 mt-1 pt-1 px-3 pb-1">
                        <Link href="/products" className="flex items-center justify-center gap-1 text-xs text-primary font-medium hover:underline py-1" onClick={() => setCategoryDropdown(false)}>
                          View All Products <ChevronDown size={12} className="rotate-[-90deg]" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {navLinks.slice(1).map((link) => (
                <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''}`}>{link.label}</Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <Link href="/track" className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition">
                <Clock size={16} /> <span className="hidden xl:inline">Track Order</span>
              </Link>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-lg transition ${searchOpen ? 'bg-gray-100 text-primary' : 'hover:bg-gray-100 text-gray-700'}`}
                aria-label="Toggle search"
              >
                <Search size={19} />
              </button>
              <Link href="/cart" className="relative p-2.5 hover:bg-gray-100 rounded-lg transition group" aria-label="Shopping cart">
                <ShoppingCart size={19} className="text-gray-700 group-hover:text-primary transition" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none shadow-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search panel */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${searchOpen ? 'max-h-20 border-t border-border' : 'max-h-0'}`}>
        <div className="container-custom py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="What are you looking for?" className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 focus:bg-white transition" autoFocus />
            </div>
            <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium whitespace-nowrap">Search</button>
            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="px-3 py-2.5 text-muted hover:text-dark transition"><X size={18} /></button>
          </form>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-fadeIn" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Navigation */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={closeAll}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">WS</span></div>
            <span className="font-bold text-sm text-primary">WALLSCAPE</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-0.5 overflow-y-auto h-[calc(100vh-4rem)]">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-2 mt-1">Menu</p>
          <MobileNavLink href="/" onClick={closeAll} isActive={pathname === '/'}>Home</MobileNavLink>
          <MobileNavLink href="/products" onClick={closeAll} isActive={pathname.startsWith('/products')}>All Products</MobileNavLink>
          <MobileNavLink href="/track" onClick={closeAll} isActive={pathname === '/track'}>Track Order</MobileNavLink>

          <div className="pt-4 pb-1 mt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
              <LayoutGrid size={12} /> Categories
            </p>
            {navCategories.map((cat) => (
              <MobileNavLink key={cat.slug} href={`/categories/${cat.slug}`} onClick={closeAll} isActive={pathname === `/categories/${cat.slug}`}>{cat.name}</MobileNavLink>
            ))}
          </div>

          <div className="pt-4 pb-1 mt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-2">More</p>
            <MobileNavLink href="/projects" onClick={closeAll} isActive={pathname === '/projects'}>Projects</MobileNavLink>
            <MobileNavLink href="/blogs" onClick={closeAll} isActive={pathname.startsWith('/blogs')}>Blog</MobileNavLink>
            <MobileNavLink href="/about" onClick={closeAll} isActive={pathname === '/about'}>About Us</MobileNavLink>
            <MobileNavLink href="/contact" onClick={closeAll} isActive={pathname === '/contact'}>Contact</MobileNavLink>
            <MobileNavLink href="/faq" onClick={closeAll} isActive={pathname === '/faq'}>FAQ</MobileNavLink>
          </div>

          <div className="pt-4 mt-3 border-t border-border">
            <a href="tel:+8801700000000" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-primary/5 text-primary font-medium hover:bg-primary/10 transition"><Phone size={16} /> +880 1700-000000</a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function MobileNavLink({ href, onClick, children, isActive }: { href: string; onClick: () => void; children: React.ReactNode; isActive?: boolean }) {
  return (
    <Link href={href} onClick={onClick} className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}>
      {children}
    </Link>
  );
}
