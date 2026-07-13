'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Grid3X3, ShoppingCart, Users, Star, FileText,
  FolderOpen, Image, ImagePlus, Settings, Shield, BarChart3, LogOut,
  Menu, X, ChevronDown, Bell, ChevronLeft, Home
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Grid3X3, label: 'Categories', href: '/admin/categories' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Star, label: 'Reviews', href: '/admin/reviews' },
  { icon: FileText, label: 'Blogs', href: '/admin/blogs' },
  { icon: FolderOpen, label: 'Projects', href: '/admin/projects' },
  { icon: Image, label: 'Gallery', href: '/admin/gallery' },
  { icon: ImagePlus, label: 'Banners', href: '/admin/banners' },
  { icon: FileText, label: 'Pages', href: '/admin/pages' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
  { icon: Shield, label: 'Admin Users', href: '/admin/users' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
];

const quickLinks = [
  { icon: Home, label: 'View Site', href: '/', external: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (adminData) setAdmin(JSON.parse(adminData));
  }, [router]);

  // Body scroll lock when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('body-no-scroll');
    } else {
      document.body.classList.remove('body-no-scroll');
    }
    return () => document.body.classList.remove('body-no-scroll');
  }, [sidebarOpen]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    toast.success('Logged out');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile header bar (fixed top) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-border flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">WS</span>
          </div>
          <span className="font-bold text-sm text-primary">Admin</span>
        </Link>
        <div className="flex items-center gap-1">
          {admin && (
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-medium text-[10px]">{admin.name?.[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 md:w-72 bg-white border-r border-border transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-14 lg:h-16 px-4 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">WS</span>
            </div>
            <div>
              <span className="font-bold text-sm text-primary block leading-tight">Admin Panel</span>
              <span className="text-[9px] text-muted">WALLSCAPE BANGLADESH</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)]">
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 pb-1 pt-1">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} className={isActive ? 'text-primary' : 'text-gray-400'} />
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-3 pb-1">Links</p>
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                <item.icon size={18} className="text-gray-400" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 mt-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition w-full"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop top bar */}
        <header className="hidden lg:flex h-16 bg-white border-b border-border items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
            >
              <Menu size={18} />
            </button>
            <span className="text-sm text-muted hidden md:block">
              {pathname.split('/').filter(Boolean).map((p, i, arr) => (
                <span key={p}>
                  <span className="capitalize">{p.replace(/-/g, ' ')}</span>
                  {i < arr.length - 1 && <span className="mx-1.5 text-gray-300">/</span>}
                </span>
              ))}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {admin && (
              <div className="flex items-center gap-2.5 text-sm">
                <div className="text-right">
                  <p className="font-medium text-sm leading-tight">{admin.name}</p>
                  <p className="text-[10px] text-muted capitalize">{admin.role?.replace('_', ' ')}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {admin.name?.[0]}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto mt-14 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
