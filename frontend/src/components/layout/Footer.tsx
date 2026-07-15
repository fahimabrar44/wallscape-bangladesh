'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { Category } from '@/types';

const fallbackCategories = [
  { name: 'PVC Wallpaper', slug: 'pvc-wallpaper' },
  { name: 'Vinyl Wallpaper', slug: 'vinyl-wallpaper' },
  { name: 'Luxury Wallpaper', slug: 'luxury-wallpaper' },
  { name: '3D Wallpaper', slug: '3d-wallpaper' },
  { name: 'Korean Wallpaper', slug: 'korean-wallpaper' },
  { name: 'Kids Wallpaper', slug: 'kids-wallpaper' },
  { name: 'Brick Wallpaper', slug: 'brick-wallpaper' },
  { name: 'Wall Panels', slug: 'wall-panels' },
  { name: 'PVC Marble Sheets', slug: 'pvc-marble-sheets' },
  { name: 'Accessories', slug: 'accessories' },
];

export default function Footer() {
  const { data: catData } = useQuery({
    queryKey: ['footer-categories'],
    queryFn: () => api.get<{ categories: Category[] }>('/api/categories?isActive=true'),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const footerCategories = catData?.categories?.length
    ? catData.categories.map((c) => ({ name: c.name, slug: c.slug }))
    : fallbackCategories;

  return (
    <footer className="bg-dark text-white">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">WS</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">WALLSCAPE</h3>
                <p className="text-[10px] text-gray-400">BANGLADESH</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Premium wallpaper & interior solutions provider in Bangladesh. Transform your space with our exquisite collection of PVC, vinyl, 3D, and luxury wallpapers.
            </p>
            <div className="card-modern p-6 mb-6">
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <p className="text-xs text-gray-400 mb-3">Get updates on new arrivals and exclusive offers.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="input-modern text-sm" />
                <button className="btn-primary"><Send size={16} /></button>
              </div>
            </div>
            <div className="flex gap-3">
              <a href="#" className="glass w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary transition"><Facebook size={16} /></a>
              <a href="#" className="glass w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary transition"><Instagram size={16} /></a>
              <a href="#" className="glass w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary transition"><Youtube size={16} /></a>
              <a href="#" className="glass w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary transition"><MessageCircle size={16} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2.5">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/products">All Products</FooterLink>
              <FooterLink href="/reviews">Customer Reviews</FooterLink>
              <FooterLink href="/projects">Our Projects</FooterLink>
              <FooterLink href="/blogs">Blog</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Categories</h4>
            <ul className="space-y-2.5">
              {footerCategories.slice(0, 7).map((cat) => (
                <FooterLink key={cat.slug} href={`/categories/${cat.slug}`}>{cat.name}</FooterLink>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary-light" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li>
                <a href="tel:+8801700000000" className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary-light transition">
                  <Phone size={16} className="shrink-0 text-primary-light" />
                  <span>+880 1700-000000</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@wallscapebd.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary-light transition">
                  <Mail size={16} className="shrink-0 text-primary-light" />
                  <span>info@wallscapebd.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} WALLSCAPE BANGLADESH. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
            <Link href="/shipping-policy" className="hover:text-white transition">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-gray-400 hover:text-primary-light transition">
        {children}
      </Link>
    </li>
  );
}
