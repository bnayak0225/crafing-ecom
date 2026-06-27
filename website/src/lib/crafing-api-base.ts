/** Crafing API base (no trailing slash). Empty string = same-origin Next.js rewrite. */
export function getCrafingApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CRAFING_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, '');
  return '';
}

/** Bearer token for `/api/v1/graphql`. */
export function getCrafingApiBearerToken(): string {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('cafing_auth_token');
    if (stored) return stored;
  }
  const fromEnv = process.env.NEXT_PUBLIC_CRAFING_API_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  return 'creator-token';
}

export const CRAFING_GRAPHQL_PATH = '/api/v1/graphql';

export function getCrafingGraphqlUrl(): string {
  return `${getCrafingApiBaseUrl()}${CRAFING_GRAPHQL_PATH}`;
}
