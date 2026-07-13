import type { Metadata } from 'next';
import '@/styles/globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { CartProvider } from '@/providers/cart-provider';
import LayoutClient from '@/components/layout/LayoutClient';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'WALLSCAPE BANGLADESH - Premium Wallpaper & Interior Solutions',
    template: '%s | WALLSCAPE BANGLADESH',
  },
  description:
    'Premium wallpaper and interior solutions in Bangladesh. Shop PVC, vinyl, 3D, luxury, Korean wallpaper and wall panels. Free consultation available.',
  keywords: [
    'wallpaper bangladesh',
    'pvc wallpaper',
    'vinyl wallpaper',
    '3d wallpaper',
    'wall panels',
    'interior design',
    'wallscape',
    'dhaka wallpaper',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_Bd',
    siteName: 'WALLSCAPE BANGLADESH',
    title: 'WALLSCAPE BANGLADESH - Premium Wallpaper & Interior Solutions',
    description:
      'Premium wallpaper and interior solutions in Bangladesh. Shop PVC, vinyl, 3D, luxury, Korean wallpaper and wall panels.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <CartProvider>
            <LayoutClient>{children}</LayoutClient>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
              }}
            />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
