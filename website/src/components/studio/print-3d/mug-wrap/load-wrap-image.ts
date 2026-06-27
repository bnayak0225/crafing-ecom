const imageCache = new Map<string, Promise<HTMLImageElement | null>>();

/** Load a wrap image from `public/`; returns null if missing or failed. */
export function loadWrapImage(src: string): Promise<HTMLImageElement | null> {
  const cached = imageCache.get(src);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    const img = new Image();
    img.decoding = 'async';
    img.onload = async () => {
      try {
        await img.decode();
      } catch {
        // decode optional — onload is enough for same-origin assets
      }
      if (img.naturalWidth > 0) {
        imageCache.set(src, Promise.resolve(img));
        resolve(img);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

  return promise;
}

export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  maxWidth: number,
  maxHeight = maxWidth,
) {
  const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
}
