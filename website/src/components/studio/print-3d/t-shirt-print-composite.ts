import * as THREE from 'three';
import { TSHIRT_PRINT } from '@/components/studio/print-3d/t-shirt-print';

const ATLAS_SIZE = 2048;

export type TShirtPrintPlacement = {
  /** Print width as a fraction of the detected chest UV band (0–1). */
  uvWidth: number;
  /** Print height = uvWidth × aspect (overrides TSHIRT_PRINT.aspect when set). */
  aspect?: number;
  /** Nudge print center in UV space. */
  offsetU: number;
  offsetV: number;
  /**
   * Rotation in degrees on top of mirror flags.
   * Prefer `mirrorX` / `mirrorY` first — easier than guessing 90/180.
   */
  rotationDeg?: number;
  /** Flip print horizontally on the UV atlas (fixes L/R mirror on this GLB). */
  mirrorX?: boolean;
  /** Flip print vertically on the UV atlas (fixes upside-down). */
  mirrorY?: boolean;
};

type UvRect = { u: number; v: number; w: number; h: number };

type ChestSample = { x: number; y: number; u: number; v: number };

function collectChestSamples(geometry: THREE.BufferGeometry): ChestSample[] {
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  if (!position || !uv) return [];

  const samples: ChestSample[] = [];
  for (let i = 0; i < position.count; i += 1) {
    const z = position.getZ(i);
    const y = position.getY(i);
    const x = position.getX(i);
    if (z > 0.04 && y > -0.05 && y < 0.18 && Math.abs(x) < 0.22) {
      samples.push({ x, y, u: uv.getX(i), v: uv.getY(i) });
    }
  }
  return samples;
}

/** Front chest vertices → UV bounding box on the shirt atlas. */
export function computeChestUvRect(geometry: THREE.BufferGeometry): UvRect {
  const samples = collectChestSamples(geometry);
  if (samples.length === 0) {
    return { u: 0.2, v: 0.15, w: 0.35, h: 0.45 };
  }

  let minU = 1;
  let maxU = 0;
  let minV = 1;
  let maxV = 0;

  for (const sample of samples) {
    minU = Math.min(minU, sample.u);
    maxU = Math.max(maxU, sample.u);
    minV = Math.min(minV, sample.v);
    maxV = Math.max(maxV, sample.v);
  }

  return { u: minU, v: minV, w: maxU - minU, h: maxV - minV };
}

/**
 * Lay print on the UV atlas (PNG orientation at rotationDeg 0), then multiply wrinkles.
 */
export function composeShirtPrintTexture(
  geometry: THREE.BufferGeometry,
  printImage: CanvasImageSource,
  fabricColor: string,
  placement: TShirtPrintPlacement,
  foldImage?: CanvasImageSource | null,
  wrinkleMultiply = 0.38,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = fabricColor;
  ctx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);

  const chest = computeChestUvRect(geometry);
  const aspect = placement.aspect ?? TSHIRT_PRINT.aspect;
  const printUvW = chest.w * placement.uvWidth;
  const printUvH = printUvW * aspect;

  const centerU = chest.u + chest.w / 2 + placement.offsetU;
  const centerV = chest.v + chest.h / 2 + placement.offsetV;
  const centerX = centerU * ATLAS_SIZE;
  const centerY = (1 - centerV) * ATLAS_SIZE;
  const drawW = printUvW * ATLAS_SIZE;
  const drawH = printUvH * ATLAS_SIZE;
  const rotation = THREE.MathUtils.degToRad(placement.rotationDeg ?? 0);
  const mirrorX = placement.mirrorX ?? false;
  const mirrorY = placement.mirrorY ?? false;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.scale(mirrorX ? -1 : 1, mirrorY ? -1 : 1);
  ctx.drawImage(printImage, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  if (foldImage) {
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = wrinkleMultiply;
    ctx.drawImage(foldImage, 0, 0, ATLAS_SIZE, ATLAS_SIZE);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = !mirrorY;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}
