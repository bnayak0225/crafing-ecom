import { getImageResizeHttpBase } from './image-tool-shared';
import { logClientError } from './log-client-error';

export type ResizeFit = 'inside' | 'cover' | 'fill';
export type CropUnit = 'percent' | 'px';
export type OutputFormat = 'jpeg' | 'png' | 'webp';
export type CropPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type CropRegion = {
  unit: CropUnit;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ResizeCustomOptions = {
  imageDataUrl: string;
  width?: number | null;
  height?: number | null;
  fit?: ResizeFit;
  position?: CropPosition;
  crop?: CropRegion | null;
  quality?: number;
  format?: OutputFormat;
  allowEnlarge?: boolean;
};

export type ResizeCustomResult = {
  width: number;
  height: number;
  byteSize: number;
  contentType: string;
  imageDataUrl: string;
};

async function parseErrorMessage(res: Response): Promise<{ message: string; details: unknown }> {
  const text = await res.text();
  if (!text) {
    return { message: res.statusText || 'Request failed', details: null };
  }
  try {
    const json = JSON.parse(text) as Record<string, unknown>;
    const error = json?.error as { message?: string } | undefined;
    const message =
      error?.message ||
      (typeof json?.message === 'string' ? json.message : null) ||
      res.statusText ||
      'Request failed';
    return { message, details: json };
  } catch {
    return { message: res.statusText || 'Request failed', details: text };
  }
}

async function imageResizeFetch(
  path: string,
  init: RequestInit,
  source: string,
): Promise<Response> {
  const url = `${getImageResizeHttpBase()}${path}`;

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed';
    logClientError({
      source,
      message,
      details: {
        url,
        hint: 'Network error — is image-resize on :4001? Check the Next.js /api/v1/tools rewrite.',
        cause: err instanceof Error ? err.cause : undefined,
      },
    });
    throw err instanceof Error ? err : new Error(message);
  }

  if (!res.ok) {
    const { message, details } = await parseErrorMessage(res);
    logClientError({
      source,
      message,
      details: { status: res.status, statusText: res.statusText, url, body: details },
    });
    throw new Error(message);
  }

  return res;
}

function getResizeApiKey(): string {
  return process.env.NEXT_PUBLIC_IMAGE_RESIZE_API_KEY?.trim() || '';
}

export async function probeImageUpload(imageDataUrl: string): Promise<{
  width: number;
  height: number;
  byteSize: number;
  contentType: string;
}> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey = getResizeApiKey();
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const res = await imageResizeFetch(
    '/api/v1/tools/probe',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ imageDataUrl }),
    },
    'image-resize/probe',
  );

  const json = await res.json();
  return json.data;
}

/** Custom resize via image-resize HTTP (port 4001). */
export async function resizeImageCustom(
  options: ResizeCustomOptions,
): Promise<ResizeCustomResult> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey = getResizeApiKey();
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const body: Record<string, unknown> = {
    imageDataUrl: options.imageDataUrl,
    fit: options.fit ?? 'inside',
    quality: options.quality ?? 85,
    format: options.format ?? 'jpeg',
    allowEnlarge: options.allowEnlarge ?? false,
  };

  if (options.width != null && options.width > 0) body.width = options.width;
  if (options.height != null && options.height > 0) body.height = options.height;
  if (options.position) body.position = options.position;
  if (options.crop) body.crop = options.crop;

  const res = await imageResizeFetch(
    '/api/v1/tools/resize/custom',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
    'image-resize/resize',
  );

  const json = await res.json();
  return json.data as ResizeCustomResult;
}
