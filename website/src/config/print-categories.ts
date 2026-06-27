import type { StudioPrintGroupId } from '@/config/studio-nav';

export type PrintCategoryVisual = 'mug' | 'tshirt' | 'photobook' | 'photo-print' | 'frame';

export type PrintCategory = {
  id: StudioPrintGroupId;
  title: string;
  headline: string;
  description: string;
  visual: PrintCategoryVisual;
  /** Static lifestyle mockup instead of the procedural 3D viewer */
  previewImage?: string;
  /** Primary CTA on the print landing row */
  ctaLabel: string;
  specs: { label: string; value: string }[];
};

export const PRINT_CATEGORIES: PrintCategory[] = [
  {
    id: 'mug',
    title: 'Mugs',
    headline: 'Wrap-around photo mugs',
    description:
      'Upload a photo or design and we print it around a durable ceramic or steel mug. Dishwasher-safe inks, vivid color, and a comfortable handle — perfect for gifts, teams, and everyday coffee.',
    visual: 'mug',
    ctaLabel: 'Explore mugs',
    specs: [
      { label: 'Sizes', value: '11 oz' },
      { label: 'Print area', value: 'Full wrap · 3.5×3.5 in' },
      { label: 'Material', value: 'Ceramic · stainless steel' },
      { label: 'Finish', value: 'Gloss · dishwasher safe' },
    ],
  },
  {
    id: 'tshirt',
    title: 'T-Shirts',
    headline: 'Custom printed tees',
    description:
      'Put your photo, logo, or artwork on a soft cotton-blend tee. Front print with vivid DTG or sublimation color — great for teams, events, merch, and everyday wear.',
    visual: 'tshirt',
    ctaLabel: 'Explore T-shirts',
    specs: [
      { label: 'Styles', value: "Men's · women's" },
      { label: 'Sizes', value: 'S · M · L · XL · 2XL' },
      { label: 'Print area', value: '12×16 in front' },
      { label: 'Material', value: 'Cotton blend · crew neck' },
      { label: 'Colors', value: 'White · black · heather' },
    ],
  },
  {
    id: 'photobook',
    title: 'Photo books',
    headline: 'Custom cover photobooks',
    description:
      'Turn your photos into a premium hardcover book. Upload a cover design with your photos and title — perfect for travel albums and gift keepsakes.',
    visual: 'photobook',
    previewImage: '/images/print/photobook-cover-preview.png',
    ctaLabel: 'Explore photo books',
    specs: [
      { label: 'Sizes', value: '8×8 in · 8×10 in' },
      { label: 'Cover', value: 'Hardcover' },
      { label: 'Paper', value: 'Matte · lustre photo paper' },
    ],
  },
  {
    id: 'photo-print',
    title: 'Photo prints',
    headline: 'Loose prints & polaroids',
    description:
      'Order individual photo prints on premium paper — classic glossy sheets or retro polaroid-style borders. Perfect for albums, scrapbooks, gifts, and tabletop displays.',
    visual: 'photo-print',
    previewImage: '/images/print/photo-prints-preview.png',
    ctaLabel: 'Explore photo prints',
    specs: [
      { label: 'Sizes', value: '4×6 · 5×7 · square' },
      { label: 'Styles', value: 'Gloss · polaroid border' },
      { label: 'Paper', value: 'Lustre photo paper' },
      { label: 'Finish', value: 'Archival · fade-resistant' },
    ],
  },
  {
    id: 'frame',
    title: 'Frames & wall art',
    headline: 'Framed prints & canvas',
    description:
      'Ready-to-hang wall art with professional framing or gallery-wrapped canvas. Choose a classic mat frame, a slim poster frame, or a textured canvas — each sized for living rooms, offices, and gallery walls.',
    visual: 'frame',
    previewImage: '/images/print/photo-print-preview.png',
    ctaLabel: 'Explore frames & wall art',
    specs: [
      { label: 'Sizes', value: '8×10 · 16×20 · 18×24 in' },
      { label: 'Styles', value: 'Mat frame · canvas · poster' },
      { label: 'Material', value: 'Wood frame · cotton canvas' },
      { label: 'Mounting', value: 'Hanging hardware included' },
    ],
  },
];

export function getPrintCategory(id: StudioPrintGroupId): PrintCategory | undefined {
  return PRINT_CATEGORIES.find((category) => category.id === id);
}

export function printCategoryHref(groupId: StudioPrintGroupId): string {
  return `/studio?section=print&group=${groupId}`;
}

export function isPrintCategoryId(id: string): id is StudioPrintGroupId {
  return PRINT_CATEGORIES.some((category) => category.id === id);
}
