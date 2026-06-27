/**
 * Coffee mug wrap — shared layout + handle gaps.
 * Artwork: `mug-wrap/themes/` (canvas) + optional images in `public/wraps/`.
 *
 * Flat sheet layout (standard sublimation unwrap):
 *   [handle gap | -------- design -------- | handle gap]
 *   left edge (x=0)                         right edge (x=width)
 *   Both edges meet at the handle on the 3D mug.
 */

import type { PrintArea } from '@/components/studio/print-3d/mug-wrap/canvas-utils';
import {
  type CoffeeMugWrapTheme,
  drawMugWrapTheme,
  paintMugWrapTheme,
} from '@/components/studio/print-3d/mug-wrap/themes';

export type { CoffeeMugWrapTheme };
export { COFFEE_MUG_WRAP_THEMES } from '@/components/studio/print-3d/mug-wrap/themes';
export {
  MUG_WRAP_LOGO_IMAGE,
  MUG_WRAP_SHEET_IMAGES,
} from '@/components/studio/print-3d/mug-wrap/wrap-image-paths';

export const COFFEE_MUG_WRAP = {
  /** Full wrap sheet — match your PNG (ratio ≈ 2.84:1, e.g. 1024×360 or 1428×500). */
  width: 1024,
  height: 360,
  /**
   * Texture rotation on the mug. `0` = sheet left/right edges (handle gaps) sit on the handle.
   * Increase to rotate the wrap around the body (e.g. `0.5` = design center faces away from handle).
   */
  uOffset: 0.75,
  defaultTheme: 'space' as CoffeeMugWrapTheme,

  /** Bare ceramic strip on each sheet edge (both meet at the handle when wrapped). */
  handleSideGapPx: 20,
  showHandleGapDebug: false,
  ceramicColor: '#ffffff',
} as const;

/** Printable band between the two handle-edge gaps. */
export function getMugWrapPrintArea(
  width = COFFEE_MUG_WRAP.width,
  height = COFFEE_MUG_WRAP.height,
): PrintArea {
  const gap = COFFEE_MUG_WRAP.handleSideGapPx;
  return {
    x: gap,
    y: 0,
    w: width - gap * 2,
    h: height,
    cx: width / 2,
    cy: height / 2,
  };
}

function drawHandleGaps(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const { handleSideGapPx, ceramicColor, showHandleGapDebug } = COFFEE_MUG_WRAP;

  ctx.fillStyle = ceramicColor;
  ctx.fillRect(0, 0, handleSideGapPx, height);
  ctx.fillRect(width - handleSideGapPx, 0, handleSideGapPx, height);

  if (showHandleGapDebug) {
    ctx.strokeStyle = '#ff2d2d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(handleSideGapPx, 0);
    ctx.lineTo(handleSideGapPx, height);
    ctx.moveTo(width - handleSideGapPx, 0);
    ctx.lineTo(width - handleSideGapPx, height);
    ctx.stroke();
  }
}

/** Instant procedural preview while sheet images load. */
export function createCoffeeMugWrapCanvasSync(
  theme: CoffeeMugWrapTheme = COFFEE_MUG_WRAP.defaultTheme,
): HTMLCanvasElement {
  const { width, height, ceramicColor } = COFFEE_MUG_WRAP;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const area = getMugWrapPrintArea(width, height);
  ctx.fillStyle = ceramicColor;
  ctx.fillRect(0, 0, width, height);
  drawMugWrapTheme(ctx, area, theme);
  drawHandleGaps(ctx, width, height);
  return canvas;
}

export async function createCoffeeMugWrapCanvas(
  theme: CoffeeMugWrapTheme = COFFEE_MUG_WRAP.defaultTheme,
): Promise<HTMLCanvasElement> {
  const { width, height, ceramicColor } = COFFEE_MUG_WRAP;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const area = getMugWrapPrintArea(width, height);
  ctx.fillStyle = ceramicColor;
  ctx.fillRect(0, 0, width, height);

  await paintMugWrapTheme(ctx, area, theme);
  drawHandleGaps(ctx, width, height);
  return canvas;
}
