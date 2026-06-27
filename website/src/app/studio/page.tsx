import type { Metadata } from 'next';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { CategoryFilter } from '@/components/CategoryFilter';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { FeaturedThemesSection } from '@/components/studio/FeaturedThemesSection';
import { PrintCategoryPicker } from '@/components/studio/PrintCategoryPicker';
import { StudioPrintSection } from '@/components/studio/StudioPrintSectionClient';
import { StudioDesignPicker } from '@/components/studio/StudioProductGrid';
import { TemplateGrid } from '@/components/TemplateGrid';
import { getPrintCategory, isPrintCategoryId } from '@/config/print-categories';
import { getStudioProduct } from '@/config/studio-nav';
import { formatStudioProductSize } from '@/config/studio-product-sizes';
import { apiServer } from '@/lib/api-server';
import { filterTemplatesForProduct } from '@/lib/studio-product-filter';
interface StudioHomeProps {
  searchParams: Promise<{ category?: string; q?: string; section?: string; type?: string; group?: string }>;
}

export async function generateMetadata({
  searchParams,
}: StudioHomeProps): Promise<Metadata> {
  const { category, q, type, section } = await searchParams;
  const product = type ? getStudioProduct(type) : undefined;

  if (product) {
    return {
      title: `${product.label} — Cafing Studio`,
      description: product.description ?? `Browse ${product.label.toLowerCase()} templates.`,
    };
  }
  if (section === 'print') {
    const { group } = await searchParams;
    if (group && isPrintCategoryId(group)) {
      const cat = getPrintCategory(group);
      return {
        title: `${cat?.title ?? 'Print'} — Cafing Studio`,
        description: cat?.description,
      };
    }
    return { title: 'Print — Cafing Studio', description: 'Mugs, tees, photo books, prints, and frames.' };
  }
  if (section === 'design' || !section) {
    return { title: 'Design — Cafing Studio', description: 'Social, banners, presentations, and more.' };
  }
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
    title: 'Studio — Cafing Studio',
    description: 'Pick a format, then choose a template to open in your editor.',
  };
}

export default async function StudioHomePage({ searchParams }: StudioHomeProps) {
  const { category = '', q = '', type = '', section = '', group = '' } = await searchParams;
  const product = type ? getStudioProduct(type) : undefined;
  const activeSection = section === 'print' ? 'print' : 'design';
  const showProductPicker = !product && !q && !category;

  if (showProductPicker && section === 'print' && isPrintCategoryId(group)) {
    return (
      <PageContainer>
        <PrintCategoryPicker groupId={group} />
      </PageContainer>
    );
  }

  if (showProductPicker) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow={activeSection === 'print' ? 'Print' : 'Design'}
          title={activeSection === 'print' ? 'Print your designs' : 'Choose a format'}
          description={
            activeSection === 'print'
              ? 'Scroll to explore mugs, tees, photo books, prints, and frames — then open a category to pick your style.'
              : 'Instagram, banners, YouTube, presentations, and more — pick a format.'
          }
        />
        {activeSection === 'print' ? (
          <StudioPrintSection />
        ) : (          <StudioDesignPicker />
        )}
        <FeaturedThemesSection section={activeSection} />
      </PageContainer>
    );
  }

  const params: Record<string, string> = { limit: '48', sort: 'popular' };
  if (q) {
    params.search = q;
  } else if (product?.category) {
    params.category = product.category;
  } else if (category) {
    params.category = category;
  } else if (section === 'print') {
    params.category = 'print';
  }

  let templates: Awaited<ReturnType<typeof apiServer.getTemplates>>['data'] = [];
  let categories: Awaited<ReturnType<typeof apiServer.getCategories>>['data'] = [];
  let formats: Awaited<ReturnType<typeof apiServer.getFormats>>['data'] = [];
  let apiError: string | null = null;

  try {
    const [tplRes, catRes, formatRes] = await Promise.all([
      apiServer.getTemplates(params),
      apiServer.getCategories(),
      apiServer.getFormats(),
    ]);
    templates = tplRes.data;
    categories = catRes.data;
    formats = formatRes.data;
  } catch (err) {
    apiError =
      err instanceof Error
        ? err.message
        : 'Could not load templates. Is the API running on port 3001?';
  }

  if (product && templates.length > 0) {
    templates = filterTemplatesForProduct(templates, product, formats);
  }

  const pageTitle = q
    ? `Results for "${q}"`
    : product
      ? product.label
      : activeSection === 'print'
        ? 'Print templates'
        : categories.find((c) => c.id === category)?.name ?? 'Templates';

  const pageDescription = product
    ? product.description ??
      `Templates sized and styled for ${product.label.toLowerCase()}. Pick one to open in the editor.`
    : 'Click any template to open it in your image editor.';

  const productSize = product ? formatStudioProductSize(product) : null;

  return (
    <PageContainer>
      <PageHeader
        eyebrow={product?.section === 'print' || activeSection === 'print' ? 'Print' : 'Design'}
        title={pageTitle}
        description={pageDescription}
      />

      {productSize ? (
        <Stack direction="row" sx={{ mb: 3, mt: -2 }}>
          <Chip label={productSize} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
        </Stack>
      ) : null}

      <CategoryFilter
        categories={categories}
        activeCategory={product?.category ?? category}
        searchQuery={q}
        hidden={Boolean(product && !q)}
      />

      {apiError ? (
        <Alert severity="warning" sx={{ borderRadius: 2, mb: 3 }}>
          {apiError}
        </Alert>
      ) : null}

      {templates.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          {apiError
            ? 'Start the API to browse templates.'
            : product
              ? `No templates for ${product.label} yet. Try another product type.`
              : 'No templates found. Try another filter.'}
        </Alert>
      ) : (
        <TemplateGrid templates={templates} />
      )}
    </PageContainer>
  );
}
