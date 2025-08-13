import React from 'react';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import '../globals.css';
import Header from '@/components/layout/header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Inspec Bull International - NDT Services',
  description: 'Leading provider of Non-Destructive Testing services with precision and perfection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white">
        <Header />
        {children}
      </body>
    </html>
  );
}