import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EPCM Demo MVP',
  description: 'Designed and developed by flowmatic.ai',
};

export default function RootLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex h-screen bg-gray-100'>
          <Sidebar />
          <main className='flex-1 overflow-hidden'>{children}</main>
        </div>
      </body>
    </html>
  );
}
