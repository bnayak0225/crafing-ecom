'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  COFFEE_MUG_WRAP,
  type CoffeeMugWrapTheme,
  createCoffeeMugWrapCanvas,
  createCoffeeMugWrapCanvasSync,
} from '@/components/studio/print-3d/coffee-mug-wrap-design';

function canvasToTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.anisotropy = 8;
  map.needsUpdate = true;
  return map;
}

/** Three.js texture for the coffee mug body wrap. */
export function useCoffeeMugWrapTexture(
  enabled = true,
  theme: CoffeeMugWrapTheme = COFFEE_MUG_WRAP.defaultTheme,
): THREE.CanvasTexture | undefined {
  const texture = useMemo(() => {
    if (!enabled || typeof document === 'undefined') return undefined;
    return canvasToTexture(createCoffeeMugWrapCanvasSync(theme));
  }, [enabled, theme]);

  useEffect(() => {
    if (!enabled || !texture || typeof document === 'undefined') return;

    let cancelled = false;

    createCoffeeMugWrapCanvas(theme).then((loaded) => {
      if (cancelled) return;
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(loaded, 0, 0);
      texture.needsUpdate = true;
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, theme, texture]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return texture;
}

export { COFFEE_MUG_WRAP };
