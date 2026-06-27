import type { PrintArea } from '@/components/studio/print-3d/mug-wrap/canvas-utils';
import {
  drawImageContain,
  loadWrapImage,
} from '@/components/studio/print-3d/mug-wrap/load-wrap-image';
import {
  MUG_WRAP_LOGO_FALLBACK,
  MUG_WRAP_LOGO_IMAGE,
  MUG_WRAP_SHEET_IMAGES,
} from '@/components/studio/print-3d/mug-wrap/wrap-image-paths';
import { drawCompanyLogoWrap } from '@/components/studio/print-3d/mug-wrap/themes/company-logo';
import { drawNatureWrap } from '@/components/studio/print-3d/mug-wrap/themes/nature';
import { drawSpaceWrap } from '@/components/studio/print-3d/mug-wrap/themes/space';

export type CoffeeMugWrapTheme = 'space' | 'nature' | 'company-logo';

export const COFFEE_MUG_WRAP_THEMES: { id: CoffeeMugWrapTheme; label: string }[] = [
  { id: 'space', label: 'Space' },
  { id: 'nature', label: 'Nature' },
  { id: 'company-logo', label: 'Crafing logo' },
];

function drawMugWrapThemeSync(
  ctx: CanvasRenderingContext2D,
  area: PrintArea,
  theme: CoffeeMugWrapTheme,
) {
  switch (theme) {
    case 'space':
      drawSpaceWrap(ctx, area);
      break;
    case 'nature':
      drawNatureWrap(ctx, area);
      break;
    case 'company-logo':
      drawCompanyLogoWrap(ctx, area);
      break;
    default:
      drawCompanyLogoWrap(ctx, area);
  }
}

/** Paints theme — full-sheet image when present, otherwise canvas art in the print band. */
export async function paintMugWrapTheme(
  ctx: CanvasRenderingContext2D,
  area: PrintArea,
  theme: CoffeeMugWrapTheme,
) {
  const sheetPath = MUG_WRAP_SHEET_IMAGES[theme];
  const sheetImage = await loadWrapImage(sheetPath);
  if (sheetImage) {
    // Image starts after the left handle gap (see getMugWrapPrintArea in coffee-mug-wrap-design.ts).
    ctx.drawImage(sheetImage, area.x, area.y, area.w, area.h);
    return;
  }

  if (theme === 'company-logo') {
    drawCompanyLogoWrap(ctx, area);
    const logoImage =
      (await loadWrapImage(MUG_WRAP_LOGO_IMAGE)) ??
      (await loadWrapImage(MUG_WRAP_LOGO_FALLBACK));
    if (logoImage) {
      drawImageContain(ctx, logoImage, area.cx, area.cy - 8, 300, 260);
    }
    return;
  }

  drawMugWrapThemeSync(ctx, area, theme);
}

/** @deprecated Use `paintMugWrapTheme` for image support. */
export function drawMugWrapTheme(
  ctx: CanvasRenderingContext2D,
  area: PrintArea,
  theme: CoffeeMugWrapTheme,
) {
  drawMugWrapThemeSync(ctx, area, theme);
}
