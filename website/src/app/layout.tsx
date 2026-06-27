import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { SiteNavbar } from '@/components/SiteNavbar';
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
        <ThemeRegistry>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <SiteNavbar />
            <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
