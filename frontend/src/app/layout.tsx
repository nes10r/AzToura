import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import SiteWrapper from '@/components/SiteWrapper';
import { SITE_NAME, SITE_DESCRIPTION } from '@/constants';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ['Azerbaijan', 'tourism', 'travel', 'Baku', 'Caucasus', 'destinations', 'hotels', 'tours'],
  authors: [{ name: 'AzTour' }],
  openGraph: { type: 'website', locale: 'en_US', siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-text antialiased">
        <ThemeProvider />
        <SiteWrapper>{children}</SiteWrapper>
      </body>
    </html>
  );
}
