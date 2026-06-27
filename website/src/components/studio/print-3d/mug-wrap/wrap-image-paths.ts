/** Drop mug wrap images in `website/public/wraps/` (see filenames below). */

import type { CoffeeMugWrapTheme } from '@/components/studio/print-3d/mug-wrap/themes';

/** Full-wrap sheet images (use `COFFEE_MUG_WRAP` width×height, ratio ≈ 2.84:1). */
export const MUG_WRAP_SHEET_IMAGES: Record<CoffeeMugWrapTheme, string> = {
  space: '/wraps/space-wrap.png',
  nature: '/wraps/nature-wrap.png',
  'company-logo': '/wraps/crafing-logo-wrap.png',
};

/** Centered logo when full sheet is missing (company-logo theme). */
export const MUG_WRAP_LOGO_IMAGE = '/wraps/crafing-logo.png';

/** Bundled fallback until you add `crafing-logo.png`. */
export const MUG_WRAP_LOGO_FALLBACK = '/wraps/crafing-logo.svg';
