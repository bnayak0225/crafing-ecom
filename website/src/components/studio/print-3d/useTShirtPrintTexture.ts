'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { TSHIRT_PRINT } from '@/components/studio/print-3d/t-shirt-print';

/** Loads the studio chest print image for men's / women's tees. */
export function useTShirtPrintTexture(enabled = true): THREE.Texture | undefined {
  const [texture, setTexture] = useState<THREE.Texture | undefined>();

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') {
      setTexture(undefined);
      return;
    }

    let current: THREE.Texture | undefined;
    let cancelled = false;

    const loader = new THREE.TextureLoader();
    loader.load(
      TSHIRT_PRINT.image,
      (loaded) => {
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.anisotropy = 16;
        loaded.needsUpdate = true;
        current = loaded;
        setTexture(loaded);
      },
      undefined,
      () => {
        if (!cancelled) setTexture(undefined);
      },
    );

    return () => {
      cancelled = true;
      current?.dispose();
      setTexture(undefined);
    };
  }, [enabled]);

  return texture;
}
