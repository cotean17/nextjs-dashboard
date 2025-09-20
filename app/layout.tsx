// /app/layout.tsx
import type { Metadata } from 'next';
import { inter } from '@/app/ui/fonts';
import '@/app/ui/global.css'; // ✅ keep THIS import (do NOT import "./global.css")

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  // Use your production URL here when you deploy
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* put the font class on <body>, not <html> */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
