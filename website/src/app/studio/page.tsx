import type { Metadata } from 'next';
import Alert from '@mui/material/Alert';
import { CategoryFilter } from '@/components/CategoryFilter';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { TemplateGrid } from '@/components/TemplateGrid';
import { apiServer } from '@/lib/api-server';

interface StudioHomeProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: StudioHomeProps): Promise<Metadata> {
  const { category, q } = await searchParams;
  if (q) {
    return {
      title: `Search: ${q} — Templates | Cafing Studio`,
      description: `Design templates matching "${q}".`,
    };
  }
  if (category) {
    return {
      title: `${category} Templates — Cafing Studio`,
      description: `Browse ${category} design templates.`,
    };
  }
  return {
    title: 'Choose a Template — Cafing Studio',
    description:
      'Pick a design template to open in your editor. Marketing, social, print, and e-commerce layouts.',
  };
}

export default async function StudioHomePage({ searchParams }: StudioHomeProps) {
  const { category = '', q = '' } = await searchParams;

  const params: Record<string, string> = { limit: '48', sort: 'popular' };
  if (category) params.category = category;
  if (q) params.search = q;

  const [tplRes, catRes] = await Promise.all([
    apiServer.getTemplates(params),
    apiServer.getCategories(),
  ]);

  const templates = tplRes.data;
  const categories = catRes.data;

  const pageTitle = q
    ? `Results for "${q}"`
    : category
      ? categories.find((c) => c.id === category)?.name ?? 'Templates'
      : 'Choose a template';

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Template library"
        title={pageTitle}
        description="Click any template to open it in your image editor. Use filters or search to narrow results."
      />

      <CategoryFilter
        categories={categories}
        activeCategory={category}
        searchQuery={q}
      />

      {templates.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No templates found. Try another filter.
        </Alert>
      ) : (
        <TemplateGrid templates={templates} />
      )}
    </PageContainer>
  );
}
