import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'

// Initialize the font
const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'imlogolabs',
  description: 'by Illustrated Maldives',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} bg-black text-white dark`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
