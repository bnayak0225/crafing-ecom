import { redirect } from 'next/navigation';

/** Legacy URL — templates live on the studio home. */
export default async function TemplatesRedirect({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const qs = new URLSearchParams();
  if (category) qs.set('category', category);
  if (q) qs.set('q', q);
  const query = qs.toString();
  redirect(query ? `/studio?${query}` : '/studio');
}
