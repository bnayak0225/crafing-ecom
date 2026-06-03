import type { Metadata } from 'next';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { dmSans } from '@/theme/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cafing Studio',
  description: 'Create stunning visuals without the clutter.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={dmSans.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
