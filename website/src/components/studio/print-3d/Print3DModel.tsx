'use client';

import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import type { CoffeeMugWrapTheme, Print3DModelConfig } from '@/config/print-3d-models';
import { PrintProceduralModel } from '@/components/studio/print-3d/PrintProceduralModel';

type Print3DModelProps = {
  config: Print3DModelConfig;
  mugWrapTheme?: CoffeeMugWrapTheme;
  shirtColor?: string;
};

export function Print3DModel({ config, mugWrapTheme, shirtColor }: Print3DModelProps) {
  if (config.gltf?.url) {
    return (
      <Suspense fallback={<PrintProceduralModel config={config} mugWrapTheme={mugWrapTheme} shirtColor={shirtColor} />}>
        <GltfProductModel config={config} />
      </Suspense>
    );
  }

  return <PrintProceduralModel config={config} mugWrapTheme={mugWrapTheme} shirtColor={shirtColor} />;
}

function GltfProductModel({ config }: { config: Print3DModelConfig }) {
  const gltf = config.gltf!;
  const { scene } = useGLTF(gltf.url);
  const scale = gltf.scale ?? 1;
  const position = gltf.position ?? [0, 0, 0];
  const rotation = gltf.rotation ?? [0, 0, 0];

  return (
    <primitive
      object={scene.clone()}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}
