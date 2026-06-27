'use client';

import dynamic from 'next/dynamic';
import { StudioPrintSectionFallback } from '@/components/studio/StudioPrintSectionFallback';

export const StudioPrintSection = dynamic(
  () => import('@/components/studio/StudioPrintSection').then((mod) => mod.StudioPrintSection),
  { ssr: false, loading: () => <StudioPrintSectionFallback /> },
);
