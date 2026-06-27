import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { CoffeeMugDimensions } from '@/components/studio/print-3d/mug-handle-geometry';
import { DEFAULT_COFFEE_MUG } from '@/components/studio/print-3d/mug-handle-geometry';

/** Height of the flat lip band at the top. */
export const COFFEE_MUG_RIM_BAND = 0.01;
const LIP_FILLET = 0.004;

export function getCoffeeMugRimTotalHeight(): number {
  return COFFEE_MUG_RIM_BAND;
}

export function getCoffeeMugTopY(dims: CoffeeMugDimensions = DEFAULT_COFFEE_MUG): number {
  return dims.height / 2;
}

function createCoffeeMugRimExtrudeGeometry(
  outerRadius: number,
  innerRadius: number,
  yTop: number,
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: COFFEE_MUG_RIM_BAND,
    bevelEnabled: true,
    bevelSize: LIP_FILLET,
    bevelThickness: LIP_FILLET,
    bevelSegments: 3,
    curveSegments: 64,
  });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, yTop, 0);
  return geo;
}

function createCoffeeMugOuterWallGeometry(
  outerRadius: number,
  wallHeight: number,
  centerY: number,
): THREE.CylinderGeometry {
  const geo = new THREE.CylinderGeometry(outerRadius, outerRadius, wallHeight, 64, 1, true);
  geo.translate(0, centerY, 0);
  return geo;
}

/**
 * Single outer shell: straight wall + extruded flat lip (no seam between them).
 */
export function createCoffeeMugOuterShellGeometry(
  outerRadius: number,
  innerRadius: number,
  mugHeight: number,
  wallHeight: number,
  wallCenterY: number,
): THREE.BufferGeometry {
  const yTop = mugHeight / 2;
  const wall = createCoffeeMugOuterWallGeometry(outerRadius, wallHeight, wallCenterY);
  const rim = createCoffeeMugRimExtrudeGeometry(outerRadius, innerRadius, yTop);
  const merged = mergeGeometries([wall, rim], false);
  wall.dispose();
  rim.dispose();
  if (!merged) {
    throw new Error('Failed to merge coffee mug outer shell geometries');
  }
  return merged;
}

export function getCoffeeMugWallHeight(dims: CoffeeMugDimensions = DEFAULT_COFFEE_MUG): number {
  return dims.height - dims.bottomThickness;
}

export function getCoffeeMugWallCenterY(dims: CoffeeMugDimensions = DEFAULT_COFFEE_MUG): number {
  const bottomY = -dims.height / 2 + dims.bottomThickness;
  const topY = getCoffeeMugTopY(dims);
  return (bottomY + topY) / 2;
}

export function getCoffeeMugInnerWallCenterY(dims: CoffeeMugDimensions = DEFAULT_COFFEE_MUG): number {
  return getCoffeeMugWallCenterY(dims);
}

export function getCoffeeMugInnerWallHeight(dims: CoffeeMugDimensions = DEFAULT_COFFEE_MUG): number {
  return getCoffeeMugWallHeight(dims);
}
