import type { Print3DProceduralParams } from '@/config/print-3d-models';
import type { TShirtPrintPlacement } from '@/components/studio/print-3d/t-shirt-print-composite';

export type TShirtFit = NonNullable<Print3DProceduralParams['shirtFit']>;

export type TShirtFitConfig = {
  meshScale: [number, number, number];
  /**
   * Print on UV atlas — tune in this block:
   * `mirrorX` / `mirrorY` fix flipped art, `rotationDeg` for fine spin, `offsetU/V` to move.
   */
  print: TShirtPrintPlacement;
};

export const TSHIRT_FIT: Record<TShirtFit, TShirtFitConfig> = {
  men: {
    meshScale: [1, 1, 1],
    print: {
      uvWidth: 0.68,
      offsetU: 0,
      offsetV: 0.2,
      rotationDeg: 180,
      mirrorX: true,
      mirrorY: true,
    },
  },
  women: {
    meshScale: [1, 1, 0.9],
    print: {
      uvWidth: 0.68,
      offsetU: 0,
      offsetV: 0.2,
      rotationDeg: 180,
      mirrorX: true,
      mirrorY: true,
    },
  },
};

export function resolveTShirtFit(
  fit: Print3DProceduralParams['shirtFit'] | undefined,
): TShirtFit {
  return fit === 'women' ? 'women' : 'men';
}
