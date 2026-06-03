'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

/** Thin client wrapper — only reads pathname for active nav styling. */
export function ActiveSidebar() {
  const pathname = usePathname() ?? '';
  return <Sidebar pathname={pathname} />;
}
