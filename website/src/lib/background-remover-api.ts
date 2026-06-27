import {
  imageResizeGraphqlSubscription,
  type SlowOperationUpdate,
} from './image-resize-graphql-ws';

export type FillType = 'transparent' | 'solid' | 'gradient' | 'image';

export type GradientStop = {
  position: number;
  color: string;
};

export type BackgroundGradient = {
  angle: number;
  type: 'linear' | 'radial';
  stops: GradientStop[];
};

const REMOVE_BACKGROUND = `
  subscription RemoveBackground($input: RemoveBackgroundInput!) {
    removeBackground(input: $input) {
      status
      message
      error
      result {
        imageDataUrl
        width
        height
        byteSize
      }
    }
  }
`;

const PREVIEW_FILL = `
  subscription PreviewFill($input: PreviewFillInput!) {
    previewFill(input: $input) {
      status
      message
      error
      result {
        imageDataUrl
        width
        height
        byteSize
      }
    }
  }
`;

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header?.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
}

export async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load background image');
  const blob = await res.blob();
  return blobToDataUrl(blob);
}

/**
 * Remove background via image-resize WebSocket (port 4001).
 * Image is sent as a data URL; result streams back as PNG data URL.
 */
export async function removeBackgroundFromUpload(
  imageDataUrl: string,
  options: {
    onProgress?: (update: SlowOperationUpdate) => void;
    onWsStatus?: (status: 'connecting' | 'connected') => void;
  } = {},
): Promise<Blob> {
  const data = await imageResizeGraphqlSubscription<'removeBackground'>(
    REMOVE_BACKGROUND,
    {
      input: {
        imageDataUrl,
        refineForeground: true,
      },
    },
    options,
  );

  const result = data.removeBackground;
  if (!result?.imageDataUrl) {
    throw new Error('Background removal completed without an image');
  }

  return dataUrlToBlob(result.imageDataUrl);
}

/** Live fill preview via image-resize WebSocket. */
export async function compositeBackgroundFill(
  options: {
    foregroundDataUrl: string;
    fillType: Exclude<FillType, 'transparent'>;
    backgroundColor?: string | null;
    backgroundGradient?: BackgroundGradient | null;
    underlayDataUrl?: string | null;
    onProgress?: (update: SlowOperationUpdate) => void;
  },
): Promise<Blob> {
  const input: Record<string, unknown> = {
    foregroundDataUrl: options.foregroundDataUrl,
    fillType: options.fillType,
  };
  if (options.backgroundColor != null) input.backgroundColor = options.backgroundColor;
  if (options.backgroundGradient != null) {
    input.backgroundGradient = options.backgroundGradient;
  }
  if (options.underlayDataUrl != null) input.underlayDataUrl = options.underlayDataUrl;

  const data = await imageResizeGraphqlSubscription<'previewFill'>(
    PREVIEW_FILL,
    { input },
    { onProgress: options.onProgress },
  );

  const result = data.previewFill;
  if (!result?.imageDataUrl) {
    throw new Error('Fill preview completed without an image');
  }

  return dataUrlToBlob(result.imageDataUrl);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_UPLOAD_BYTES = 40 * 1024 * 1024;

export const SOLID_PRESETS = [
  { id: 'white', label: 'White', color: '#FFFFFF' },
  { id: 'black', label: 'Black', color: '#12141C' },
  { id: 'mist', label: 'Mist', color: '#F8FAFC' },
  { id: 'violet', label: 'Violet', color: '#5F61F2' },
] as const;

export const GRADIENT_PRESETS: { id: string; label: string; gradient: BackgroundGradient }[] = [
  {
    id: 'brand',
    label: 'Cafing',
    gradient: {
      angle: 135,
      type: 'linear',
      stops: [
        { position: 0, color: '#04DDED' },
        { position: 45, color: '#5F61F2' },
        { position: 100, color: '#9628B3' },
      ],
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    gradient: {
      angle: 120,
      type: 'linear',
      stops: [
        { position: 0, color: '#F97316' },
        { position: 50, color: '#EC4899' },
        { position: 100, color: '#8B5CF6' },
      ],
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    gradient: {
      angle: 180,
      type: 'linear',
      stops: [
        { position: 0, color: '#0EA5E9' },
        { position: 100, color: '#1E3A8A' },
      ],
    },
  },
  {
    id: 'mint',
    label: 'Mint',
    gradient: {
      angle: 90,
      type: 'linear',
      stops: [
        { position: 0, color: '#A7F3D0' },
        { position: 100, color: '#14B8A6' },
      ],
    },
  },
];

export const STOCK_BACKGROUNDS = [
  {
    id: 'sky',
    label: 'Sky',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: 'studio',
    label: 'Studio',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
  },
  {
    id: 'nature',
    label: 'Nature',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
  {
    id: 'abstract',
    label: 'Abstract',
    url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80',
  },
] as const;
