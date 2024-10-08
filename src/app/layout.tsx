import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';
import React from 'react';
import Providers from '@/app/providers';
import Header from '@/components/header';

const montserrat = Montserrat({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tela Erros',
  description: 'Tela de Erros',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col p-5">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
