/**
 * Root Layout Component
 *
 * Main layout wrapper for the entire application.
 * Loads hospital configuration and applies theme CSS variables.
 */

import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getCurrentHospitalConfig, generateThemeCSS } from '@/lib/config';

// Font configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

// Load hospital configuration
const config = getCurrentHospitalConfig();

// Generate metadata from hospital config
export const metadata: Metadata = {
  title: {
    default: config.hospital.name,
    template: `%s | ${config.hospital.name}`,
  },
  description: config.hospital.tagline,
  keywords: [
    'hospital',
    'healthcare',
    'medical',
    'doctors',
    'appointments',
    'emergency',
    config.hospital.name,
  ],
  authors: [{ name: config.hospital.name }],
  creator: config.hospital.name,
  publisher: config.hospital.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: config.hospital.name,
    description: config.hospital.tagline,
    siteName: config.hospital.name,
    images: [
      {
        url: config.hospital.logo,
        width: 1200,
        height: 630,
        alt: config.hospital.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.hospital.name,
    description: config.hospital.tagline,
    images: [config.hospital.logo],
  },
  icons: {
    icon: config.hospital.favicon,
    shortcut: config.hospital.favicon,
    apple: config.hospital.logo,
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate theme CSS from hospital config
  const themeCSS = generateThemeCSS(config);

  return (
    <html lang={config.languages.default} className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Inject theme CSS variables */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header config={config} />
          <main className="flex-1">{children}</main>
          <Footer config={config} />
        </div>
      </body>
    </html>
  );
}
