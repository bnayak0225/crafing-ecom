export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_UPLOAD_BYTES = 40 * 1024 * 1024;

export function getImageResizeHttpBase(): string {
  const explicit = process.env.NEXT_PUBLIC_IMAGE_RESIZE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  // Browser: same-origin via Next.js /api/v1/tools/* rewrite (avoids CORS to :4001).
  if (typeof window !== 'undefined') return '';

  return (process.env.IMAGE_RESIZE_URL || 'http://127.0.0.1:4001').replace(/\/$/, '');
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header?.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
