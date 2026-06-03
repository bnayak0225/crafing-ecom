import type { Metadata } from 'next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { PricingGrid } from '@/components/PricingGrid';
import { apiServer } from '@/lib/api-server';

export const metadata: Metadata = {
  title: 'Pricing — Cafing Studio',
  description: 'Starter, Creator, and Studio plans. Start free and upgrade when you need more.',
};

export default async function PricingPage() {
  const { data: plans } = await apiServer.getPricing();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Pricing"
        title="Plans that scale with your team"
        description="Start free. Upgrade when you need more exports, brand tools, and collaboration."
      />
      <PricingGrid plans={plans} />
    </PageContainer>
  );
}
