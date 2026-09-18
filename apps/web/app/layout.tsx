import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';
import { Header } from '@/components/header/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'zawosite',
    description: 'made by zawodev ' + 'v3.0.1',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} overflow-x-hidden`} suppressHydrationWarning>
                <Providers>
                    <Header />
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}
