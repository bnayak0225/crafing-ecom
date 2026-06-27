'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';

type Print3DSceneReadyProps = {
  onReady: () => void;
};

/** Fires once assets are loaded and a few frames have rendered. */
export function Print3DSceneReady({ onReady }: Print3DSceneReadyProps) {
  const { active } = useProgress();
  const frames = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    frames.current = 0;
    done.current = false;
  }, [onReady]);

  useFrame(() => {
    if (done.current) return;

    if (active) {
      frames.current = 0;
      return;
    }

    frames.current += 1;
    if (frames.current >= 3) {
      done.current = true;
      onReady();
    }
  });

  return null;
}
