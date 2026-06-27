import type { Metadata } from 'next';
import { BackgroundRemoverTool } from '@/components/tools/BackgroundRemoverTool';

export const metadata: Metadata = {
  title: 'Free background remover — Cafing Studio',
  description:
    'Remove image backgrounds online for free. Upload a photo, customize with color, gradient, or background image, and download instantly.',
  openGraph: {
    title: 'Free background remover — Cafing Studio',
    description:
      'Remove backgrounds and add a new color, gradient, or photo — free, no sign-in, no saving.',
    type: 'website',
  },
};

export default function RemoveBackgroundPage() {
  return <BackgroundRemoverTool />;
}
