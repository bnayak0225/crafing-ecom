import { getServerApiBase } from './api-base';
import type {
  Category,
  Format,
  Paginated,
  PricingPlan,
  Project,
  Template,
  User,
} from '@/types';

async function fetchJson<T>(path: string): Promise<T> {
  const base = getServerApiBase();
  const url = `${base}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: 60 },
    });
  } catch (err) {
    const cause = err instanceof Error ? err.cause ?? err.message : String(err);
    throw new Error(
      `API unreachable at ${url}. Start the mock API: cd api && npm run dev — ${cause}`,
    );
  }

  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json();
}

/** Server-only API client — use in Server Components and generateMetadata. */
export const apiServer = {
  getTemplates: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return fetchJson<Paginated<Template>>(`/api/templates${q}`);
  },
  getTemplate: (id: string) => fetchJson<Template>(`/api/templates/${id}`),
  getCategories: () => fetchJson<{ data: Category[] }>('/api/categories'),
  getCategory: (id: string) =>
    fetchJson<Category & { templates: Template[] }>(`/api/categories/${id}`),
  getProjects: (limit = 4) =>
    fetchJson<Paginated<Project>>(`/api/projects?limit=${limit}`),
  getUser: () => fetchJson<User>('/api/users/me'),
  getFormats: () => fetchJson<{ data: Format[] }>('/api/formats'),
  getPricing: () => fetchJson<{ data: PricingPlan[] }>('/api/pricing'),
  search: (q: string) =>
    fetchJson<{ templates: Template[]; categories: Category[] }>(
      `/api/search?q=${encodeURIComponent(q)}`
    ),
};
