import type { Metadata } from 'next';
import { ImageResizerTool } from '@/components/tools/ImageResizerTool';

export const metadata: Metadata = {
  title: 'Free image resizer — Cafing Studio',
  description:
    'Resize, crop, and compress images online for free. Set dimensions, crop by percent or pixels, and control output quality.',
  openGraph: {
    title: 'Free image resizer — Cafing Studio',
    description: 'Resize and crop photos — free, no sign-in, processed in memory only.',
    type: 'website',
  },
};

export default function ResizeImagePage() {
  return <ImageResizerTool />;
}
