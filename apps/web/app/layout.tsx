import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { BackgroundRenderer } from '@/components/backgrounds/BackgroundRenderer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'zawosite',
  description: 'made by zawodev v3.0.1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden flex min-h-screen flex-col`} suppressHydrationWarning>
        <Providers>
          <BackgroundRenderer />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
