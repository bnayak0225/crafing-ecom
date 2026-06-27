import type { Metadata } from 'next';
import Alert from '@mui/material/Alert';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { PricingGrid } from '@/components/PricingGrid';
import { apiServer } from '@/lib/api-server';
import type { PricingPlan } from '@/types';

export const metadata: Metadata = {
  title: 'Pricing — Cafing Studio',
  description: 'Starter, Creator, and Studio plans. Start free and upgrade when you need more.',
};

export default async function PricingPage() {
  let plans: PricingPlan[] = [];
  let apiError: string | null = null;

  try {
    const res = await apiServer.getPricing();
    plans = res.data;
  } catch (err) {
    apiError =
      err instanceof Error
        ? err.message
        : 'Could not load pricing. Is the API running on port 3001?';
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Pricing"
        title="Plans that scale with your team"
        description="Start free. Upgrade when you need more exports, brand tools, and collaboration."
      />
      {apiError ? (
        <Alert severity="warning" sx={{ borderRadius: 2, mb: 3 }}>
          {apiError}
        </Alert>
      ) : null}
      <PricingGrid plans={plans} />
    </PageContainer>
  );
}
