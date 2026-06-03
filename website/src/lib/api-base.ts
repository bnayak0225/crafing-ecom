/** Absolute API base for server-side fetch (SSR). */
export function getServerApiBase(): string {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'
  );
}

/** API base for browser / client components (same-origin rewrites in dev). */
export function getClientApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || '';
}
