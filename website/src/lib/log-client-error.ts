export type ClientErrorContext = {
  source: string;
  message: string;
  details?: unknown;
};

/** Browser errors → POST /api/dev/log → printed in `npm run dev` terminal. */
export function logClientError(context: ClientErrorContext) {
  const label = `[${context.source}]`;
  const payload = {
    ...context,
    at: new Date().toISOString(),
  };

  if (typeof window === 'undefined') {
    console.error(label, context.message, context.details ?? '');
    return;
  }

  console.error(label, context.message, context.details ?? '');

  void fetch('/api/dev/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function reportToolError(source: string, err: unknown, details?: unknown) {
  logClientError({
    source,
    message: errorMessage(err, 'Unknown error'),
    details: details ?? (err instanceof Error ? { name: err.name, stack: err.stack } : err),
  });
}
