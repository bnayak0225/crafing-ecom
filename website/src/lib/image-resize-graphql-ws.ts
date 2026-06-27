import { createClient, type Client } from 'graphql-ws';
import { logClientError } from './log-client-error';

export type SlowOperationStatus = 'STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type SlowOperationUpdate = {
  status: SlowOperationStatus;
  message?: string | null;
  error?: string | null;
  result?: {
    imageDataUrl: string;
    maskDataUrl?: string | null;
    width?: number | null;
    height?: number | null;
    byteSize?: number | null;
  } | null;
};

const WS_CONNECT_TIMEOUT_MS = Number(
  process.env.NEXT_PUBLIC_IMAGE_RESIZE_WS_CONNECT_TIMEOUT_MS || 30_000,
);

/** Direct browser WebSocket to image-resize (port 4001). */
export function getImageResizeGraphqlWsUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_IMAGE_RESIZE_GRAPHQL_WS_URL?.trim();
  if (explicit) return explicit;

  const base = process.env.NEXT_PUBLIC_IMAGE_RESIZE_URL?.trim();
  if (base) {
    return `${base.replace(/^http/i, 'ws').replace(/\/$/, '')}/graphql`;
  }

  return 'ws://127.0.0.1:4001/graphql';
}

function getImageResizeApiBearerToken(): string {
  return process.env.NEXT_PUBLIC_IMAGE_RESIZE_API_KEY?.trim() || '';
}

function createWsClient(): Client {
  return createClient({
    url: getImageResizeGraphqlWsUrl(),
    connectionParams: () => {
      const token = getImageResizeApiBearerToken();
      return token ? { authorization: `Bearer ${token}` } : {};
    },
    lazy: false,
    retryAttempts: 3,
    shouldRetry: () => true,
  });
}

export async function connectImageResizeGraphqlWs(options?: {
  onStatus?: (status: 'connecting' | 'connected') => void;
}): Promise<Client> {
  const client = createWsClient();
  options?.onStatus?.('connecting');

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    const finish = (fn: (value?: unknown) => void, value?: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      offConnected();
      offError();
      fn(value);
    };

    const timer = setTimeout(() => {
      const message =
        'Image-resize WebSocket timed out. Is the service running on port 4001?';
      logClientError({
        source: 'image-resize/ws-connect',
        message,
        details: { url: getImageResizeGraphqlWsUrl(), timeoutMs: WS_CONNECT_TIMEOUT_MS },
      });
      finish(reject, new Error(message));
    }, WS_CONNECT_TIMEOUT_MS);

    const offConnected = client.on('connected', () => {
      options?.onStatus?.('connected');
      finish(resolve);
    });

    const offError = client.on('error', (err) => {
      const message = err instanceof Error ? err.message : 'WebSocket connection failed';
      logClientError({
        source: 'image-resize/ws-connect',
        message,
        details: { url: getImageResizeGraphqlWsUrl(), err },
      });
      finish(reject, new Error(message));
    });
  });

  return client;
}

function getSubscriptionFieldName(query: string): string {
  const match = query.match(/subscription\s+\w+[^{]*{\s*(\w+)/);
  return match?.[1] ?? 'Anonymous';
}

export function imageResizeGraphqlSubscriptionOnClient<TField extends string>(
  wsClient: Client,
  query: string,
  variables: Record<string, unknown>,
  options: {
    onProgress?: (update: SlowOperationUpdate) => void;
  } = {},
): Promise<Record<TField, NonNullable<SlowOperationUpdate['result']>>> {
  const fieldName = getSubscriptionFieldName(query) as TField;

  return new Promise((resolve, reject) => {
    let settled = false;
    const unsubscribe = wsClient.subscribe(
      { query, variables },
      {
        next(payload) {
          const errors = payload?.errors;
          if (errors?.length) {
            if (!settled) {
              settled = true;
              unsubscribe();
              const message = errors.map((entry) => entry.message).join('; ');
              logClientError({
                source: `image-resize/ws:${String(fieldName)}`,
                message,
                details: { errors, variables },
              });
              reject(new Error(message));
            }
            return;
          }

          const update = payload?.data?.[fieldName] as SlowOperationUpdate | undefined;
          if (!update) return;

          options.onProgress?.(update);

          if (update.status === 'COMPLETED') {
            if (!settled) {
              settled = true;
              unsubscribe();
              if (!update.result?.imageDataUrl) {
                const message = `${String(fieldName)} completed without an image`;
                logClientError({
                  source: `image-resize/ws:${String(fieldName)}`,
                  message,
                  details: { update, variables },
                });
                reject(new Error(message));
                return;
              }
              resolve({ [fieldName]: update.result } as Record<
                TField,
                NonNullable<SlowOperationUpdate['result']>
              >);
            }
            return;
          }

          if (update.status === 'FAILED') {
            if (!settled) {
              settled = true;
              unsubscribe();
              const message = update.error || `${String(fieldName)} failed`;
              logClientError({
                source: `image-resize/ws:${String(fieldName)}`,
                message,
                details: { update, variables },
              });
              reject(new Error(message));
            }
          }
        },
        error(err) {
          if (!settled) {
            settled = true;
            const message = err instanceof Error ? err.message : String(err);
            logClientError({
              source: `image-resize/ws:${String(fieldName)}`,
              message,
              details: { err, variables },
            });
            reject(err instanceof Error ? err : new Error(message));
          }
        },
        complete() {
          if (!settled) {
            settled = true;
            const message = `${String(fieldName)} ended before completion`;
            logClientError({
              source: `image-resize/ws:${String(fieldName)}`,
              message,
              details: { variables },
            });
            reject(new Error(message));
          }
        },
      },
    );
  });
}

export async function imageResizeGraphqlSubscription<TField extends string>(
  query: string,
  variables: Record<string, unknown>,
  options: {
    onProgress?: (update: SlowOperationUpdate) => void;
    onWsStatus?: (status: 'connecting' | 'connected') => void;
    wsClient?: Client;
  } = {},
): Promise<Record<TField, NonNullable<SlowOperationUpdate['result']>>> {
  if (typeof window === 'undefined') {
    throw new Error('Image-resize subscriptions require a browser environment');
  }

  const ownsClient = !options.wsClient;
  const wsClient =
    options.wsClient ||
    (await connectImageResizeGraphqlWs({ onStatus: options.onWsStatus }));

  try {
    return await imageResizeGraphqlSubscriptionOnClient<TField>(
      wsClient,
      query,
      variables,
      options,
    );
  } finally {
    if (ownsClient) {
      const disposed = wsClient.dispose();
      if (disposed && typeof disposed.catch === 'function') {
        await disposed.catch(() => {});
      }
    }
  }
}
