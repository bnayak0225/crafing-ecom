'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { CoffeeMugWrapTheme, Print3DModelConfig, Print3DProceduralKind } from '@/config/print-3d-models';
import { COFFEE_MUG_WRAP } from '@/components/studio/print-3d/coffee-mug-wrap-design';
import { CoffeeMug } from '@/components/studio/print-3d/CoffeeMug';
import { TShirt } from '@/components/studio/print-3d/TShirt';
import { createTravelMugHandleGeometry } from '@/components/studio/print-3d/mug-handle-geometry';
import { useCoffeeMugWrapTexture } from '@/components/studio/print-3d/useCoffeeMugWrapTexture';
import { usePrintPreviewTexture } from '@/components/studio/print-3d/usePrintPreviewTexture';
import { useTShirtPrintTexture } from '@/components/studio/print-3d/useTShirtPrintTexture';

type PrintProceduralModelProps = {
  config: Print3DModelConfig;
  mugWrapTheme?: CoffeeMugWrapTheme;
  shirtColor?: string;
};

export function PrintProceduralModel({ config, mugWrapTheme, shirtColor }: PrintProceduralModelProps) {
  const { kind, params = {} } = config.procedural;
  const isCoffeeMug = kind === 'coffee-mug';
  const isTShirt = kind === 't-shirt';
  const usesPreviewTexture = kind !== 'travel-mug' && !isCoffeeMug && !isTShirt;
  const tshirtParams = isTShirt && shirtColor ? { ...params, color: shirtColor } : params;
  const wrapTheme: CoffeeMugWrapTheme =
    mugWrapTheme ?? params.wrapTheme ?? COFFEE_MUG_WRAP.defaultTheme;
  const mugWrapMap = useCoffeeMugWrapTexture(isCoffeeMug, wrapTheme);
  const tshirtMap = useTShirtPrintTexture(isTShirt);
  const map = usePrintPreviewTexture(usesPreviewTexture ? config.id : '__white__');

  const modelOffset: [number, number, number] =
    kind === 't-shirt' ? [0, -0.1, 0] : [0, -0.15, 0];

  return (
    <group position={modelOffset}>
      <ModelByKind
        kind={kind}
        params={isTShirt ? tshirtParams : params}
        map={
          isCoffeeMug
            ? mugWrapMap
            : isTShirt
              ? tshirtMap
              : usesPreviewTexture
                ? map
                : undefined
        }
      />
    </group>
  );
}

function ModelByKind({
  kind,
  params = {},
  map,
}: {
  kind: Print3DProceduralKind;
  params?: Print3DModelConfig['procedural']['params'];
  map?: THREE.Texture;
}) {
  switch (kind) {
    case 'coffee-mug':
      return <CoffeeMug params={params} map={map} />;
    case 'travel-mug':
      return <TravelMug params={params} />;
    case 't-shirt':
      return <TShirt params={params} map={map} />;
    case 'picture-frame':
      return <WallFrame frameWidth={0.14} aspect={0.8} params={params} map={map} />;
    case 'canvas-print':
      return <CanvasWrap params={params} map={map} />;
    case 'poster-frame':
      return <WallFrame frameWidth={0.08} aspect={0.68} params={params} map={map} />;
    default:
      return null;
  }
}

function TravelMug({
  params,
}: {
  params: NonNullable<Print3DModelConfig['procedural']['params']>;
}) {
  const radius = params.bodyRadius ?? 0.46;
  const height = params.bodyHeight ?? 1.35;
  const handleGeometry = useMemo(
    () => createTravelMugHandleGeometry(radius, height),
    [radius, height],
  );

  useEffect(() => () => handleGeometry.dispose(), [handleGeometry]);

  const mugMaterial = {
    color: '#ffffff',
    roughness: params.roughness ?? 0.3,
    metalness: params.metalness ?? 0.02,
  };

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 64]} />
        <meshStandardMaterial {...mugMaterial} />
      </mesh>
      <mesh castShadow position={[0, height / 2 + 0.05, 0]}>
        <cylinderGeometry args={[radius * 1.02, radius * 1.02, 0.12, 48]} />
        <meshStandardMaterial {...mugMaterial} roughness={0.26} />
      </mesh>
      <mesh geometry={handleGeometry} castShadow>
        <meshStandardMaterial {...mugMaterial} roughness={0.32} />
      </mesh>
    </group>
  );
}

function WallFrame({
  frameWidth,
  aspect,
  params,
  map,
}: {
  frameWidth: number;
  aspect: number;
  params: NonNullable<Print3DModelConfig['procedural']['params']>;
  map: THREE.Texture;
}) {
  const height = 1.55;
  const width = height * aspect;
  const depth = 0.06;

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width + frameWidth * 2, height + frameWidth * 2, depth]} />
        <meshStandardMaterial color={params.color ?? '#3d3228'} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.01]} castShadow>
        <boxGeometry args={[width, height, 0.015]} />
        <meshStandardMaterial map={map} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.025]}>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
    </group>
  );
}

function CanvasWrap({
  params,
  map,
}: {
  params: NonNullable<Print3DModelConfig['procedural']['params']>;
  map: THREE.Texture;
}) {
  return (
    <group rotation={[0, -0.25, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.35, 1.05, 0.12]} />
        <meshStandardMaterial map={map} roughness={0.75} metalness={0} />
      </mesh>
      {[1, -1].map((sign) => (
        <mesh key={sign} position={[0, sign * 0.525, 0]}>
          <boxGeometry args={[1.35, 0.04, 0.14]} />
          <meshStandardMaterial color={params.color ?? '#eceff3'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
