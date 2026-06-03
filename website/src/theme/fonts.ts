import { DM_Sans } from 'next/font/google';

/** Loaded once — use `dmSans.className` on `<body>` and `fontFamily` in MUI theme. */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

/** Resolved font stack for MUI `typography.fontFamily` */
export const fontFamily = dmSans.style.fontFamily;
