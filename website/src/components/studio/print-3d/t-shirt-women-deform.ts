import * as THREE from 'three';
import type { TShirtFit } from '@/components/studio/print-3d/t-shirt-fit';

/**
 * Women's silhouette tweak on the male GLB — chest forward, cinched waist.
 * Tune bands in `TSHIRT_WOMEN_DEFORM` (normalized shirt height: 0 = hem, 1 = collar).
 */
export const TSHIRT_WOMEN_DEFORM = {
  /** Chest band — push front vertices outward (+Z). */
  chest: {
    centerT: 0.66,
    widthT: 0.2,
    pushZ: 0.025,
    /** Only deform the front panel (positive local Z). */
    frontZMin: 0.01,
  },
  /** Waist band — pull sides inward. */
  waist: {
    centerT: 0.36,
    widthT: 0.13,
    pinchX: 0.8,
  },
  /** Lower hem — slight hip flare so the waist pinch reads clearly. */
  hip: {
    centerT: 0.14,
    widthT: 0.12,
    flareX: 1.05,
  },
} as const;

/** Smooth bell 0→1→0 around `center` with half-width `width`. */
function bandWeight(t: number, center: number, width: number): number {
  if (width <= 0) return 0;
  const x = (t - center) / width;
  if (Math.abs(x) >= 1) return 0;
  const w = 1 - x * x;
  return w * w;
}

export function deformWomenShirtGeometry(geometry: THREE.BufferGeometry): void {
  const position = geometry.attributes.position as THREE.BufferAttribute;
  if (!position) return;

  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return;

  const minY = box.min.y;
  const height = box.max.y - minY;
  if (height <= 0) return;

  const { chest, waist, hip } = TSHIRT_WOMEN_DEFORM;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i);
    const t = (vertex.y - minY) / height;

    const chestW = bandWeight(t, chest.centerT, chest.widthT);
    if (chestW > 0 && vertex.z > chest.frontZMin) {
      const frontBias = THREE.MathUtils.clamp(vertex.z / box.max.z, 0, 1);
      vertex.z += chest.pushZ * chestW * frontBias;
    }

    const waistW = bandWeight(t, waist.centerT, waist.widthT);
    if (waistW > 0) {
      const sideBias = THREE.MathUtils.clamp(Math.abs(vertex.x) / (box.max.x || 1), 0.15, 1);
      const pinch = THREE.MathUtils.lerp(1, waist.pinchX, waistW * sideBias);
      vertex.x *= pinch;
    }

    const hipW = bandWeight(t, hip.centerT, hip.widthT);
    if (hipW > 0) {
      const sideBias = THREE.MathUtils.clamp(Math.abs(vertex.x) / (box.max.x || 1), 0.2, 1);
      const flare = THREE.MathUtils.lerp(1, hip.flareX, hipW * sideBias);
      vertex.x *= flare;
    }

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export function createShirtGeometryForFit(
  source: THREE.BufferGeometry,
  fit: TShirtFit,
): THREE.BufferGeometry {
  const geometry = source.clone();
  geometry.deleteAttribute('color');
  if (fit === 'women') {
    deformWomenShirtGeometry(geometry);
  }
  return geometry;
}
