type SizeProduct = {
  id: string;
  width?: number;
  height?: number;
  sizeLabel?: string;
};

type PixelSize = { width: number; height: number };
type LabelSize = { sizeLabel: string };
type PixelAndLabel = PixelSize & LabelSize;

type StudioProductSize = PixelSize | LabelSize | PixelAndLabel;

/** Pixel or physical dimensions for every studio product id. */
export const STUDIO_PRODUCT_SIZES: Record<string, StudioProductSize> = {
  // Instagram
  'instagram-post': { width: 1080, height: 1080 },
  'instagram-story': { width: 1080, height: 1920 },
  'instagram-reel-cover': { width: 1080, height: 1920 },
  // Facebook
  'facebook-cover': { width: 820, height: 312 },
  'facebook-post': { width: 1200, height: 630 },
  'facebook-event-cover': { width: 1920, height: 1005 },
  // YouTube & video
  'youtube-thumbnail': { width: 1280, height: 720 },
  'youtube-channel-art': { width: 2560, height: 1440 },
  'video-intro': { width: 1920, height: 1080 },
  'twitch-banner': { width: 1200, height: 480 },
  // LinkedIn
  'linkedin-banner': { width: 1584, height: 396 },
  'linkedin-post': { width: 1200, height: 627 },
  // X, Pinterest, TikTok
  'twitter-header': { width: 1500, height: 500 },
  'twitter-post': { width: 1600, height: 900 },
  'pinterest-pin': { width: 1000, height: 1500 },
  'tiktok-cover': { width: 1080, height: 1920 },
  // Marketing
  'web-banner': { width: 970, height: 250 },
  'display-ad': { width: 300, height: 250 },
  'email-header': { width: 600, height: 200 },
  'digital-flyer': { width: 1080, height: 1920 },
  'digital-poster': { width: 1080, height: 1920 },
  logo: { width: 500, height: 500 },
  // E-commerce
  'product-card': { width: 1080, height: 1080 },
  'shop-banner': { width: 1200, height: 300 },
  'sale-badge': { width: 500, height: 500 },
  // Events
  invitation: { width: 1080, height: 1920 },
  'event-poster': { width: 1080, height: 1920 },
  ticket: { width: 1800, height: 600 },
  // Documents
  presentation: { width: 1920, height: 1080 },
  infographic: { width: 1080, height: 1920 },
  resume: { width: 2480, height: 3508, sizeLabel: 'A4' },
  'report-cover': { width: 2480, height: 3508, sizeLabel: 'A4' },
  certificate: { width: 3508, height: 2480, sizeLabel: 'A4 landscape' },
  // General
  'social-post': { width: 1080, height: 1080 },
  'photo-collage': { width: 1080, height: 1080 },
  'whatsapp-status': { width: 1080, height: 1920 },
  'custom-size': { sizeLabel: 'Custom' },
  // Print
  photobook: { sizeLabel: '8×8 in' },
  'standard-photo-print': { sizeLabel: '4×6 · 5×7 in' },
  'polaroid-print': { sizeLabel: '4×4 in · white border' },
  'coffee-mug': { sizeLabel: '11 oz · 3.5×3.5 in wrap' },
  'travel-mug': { sizeLabel: '15 oz · 3×8 in wrap' },
  't-shirt-men': { sizeLabel: '12×16 in front · men’s' },
  't-shirt-women': { sizeLabel: '12×16 in front · women’s' },
  'picture-frame': { sizeLabel: '8×10 in with mat' },
  'canvas-print': { sizeLabel: '16×20 in' },
  'poster-frame': { sizeLabel: '18×24 in' },
};

function formatPixelSize(width: number, height: number): string {
  return `${width.toLocaleString()} × ${height.toLocaleString()}`;
}

function formatSizeEntry(entry: StudioProductSize): string {
  const hasPixels = 'width' in entry && 'height' in entry;
  const hasLabel = 'sizeLabel' in entry && entry.sizeLabel;

  if (hasLabel && hasPixels) {
    return `${entry.sizeLabel} · ${formatPixelSize(entry.width, entry.height)}`;
  }
  if (hasLabel) {
    return entry.sizeLabel;
  }
  if (hasPixels) {
    return formatPixelSize(entry.width, entry.height);
  }
  return '';
}

export function formatStudioProductSize(product: SizeProduct): string | null {
  if (product.sizeLabel) {
    if (product.width != null && product.height != null) {
      return `${product.sizeLabel} · ${formatPixelSize(product.width, product.height)}`;
    }
    return product.sizeLabel;
  }

  if (product.width != null && product.height != null) {
    return formatPixelSize(product.width, product.height);
  }

  const mapped = STUDIO_PRODUCT_SIZES[product.id];
  if (!mapped) return null;

  const formatted = formatSizeEntry(mapped);
  return formatted || null;
}

export function studioProductSizeSearchText(product: SizeProduct): string {
  const formatted = formatStudioProductSize(product);
  if (!formatted) return '';

  const mapped = STUDIO_PRODUCT_SIZES[product.id];
  const parts = [formatted];

  if (mapped && 'width' in mapped && 'height' in mapped) {
    parts.push(String(mapped.width), String(mapped.height));
  }
  if (mapped && 'sizeLabel' in mapped) {
    parts.push(mapped.sizeLabel);
  }

  return parts.join(' ').toLowerCase();
}
