// src/app/layout.tsx

import React from 'react';
import ChatLayout from '@/app/components/ChatLayout';
import Header from '@/app/components/Header';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClassBot',
  description: 'Dein Lernunterstützer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChatLayout>
          <Header />
          {children}
        </ChatLayout>
      </body>
    </html>
  )
}
