import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata, Viewport } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
};

export const metadata: Metadata = {
  title: 'MBKM Undip Dashboard',
  description:
    'Dashboard for MBKM (Merdeka Belajar Kampus Merdeka) Undip program management',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MBKM Undip'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    title: 'MBKM Undip Dashboard',
    description:
      'Dashboard for MBKM (Merdeka Belajar Kampus Merdeka) Undip program management',
    siteName: 'MBKM Undip'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBKM Undip Dashboard',
    description:
      'Dashboard for MBKM (Merdeka Belajar Kampus Merdeka) Undip program management'
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
