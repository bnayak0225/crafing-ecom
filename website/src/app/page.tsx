import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { apiServer } from '@/lib/api-server';

export const metadata: Metadata = {
  title: 'Cafing Studio — Professional design templates',
  description:
    'Browse templates, pick a format, and create in your light image-editor. A clean design studio for social, print, and e-commerce.',
  openGraph: {
    title: 'Cafing Studio',
    description: 'Create stunning visuals without the clutter.',
    type: 'website',
  },
};

export default async function HomePage() {
  let templates: Awaited<ReturnType<typeof apiServer.getTemplates>>['data'] = [];

  try {
    const res = await apiServer.getTemplates({ limit: '6', sort: 'popular' });
    templates = res.data;
  } catch {
    templates = [];
  }

  return <LandingPage templates={templates} />;
}
