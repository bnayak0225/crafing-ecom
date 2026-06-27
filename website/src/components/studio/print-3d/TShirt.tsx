'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { Center, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Print3DModelConfig } from '@/config/print-3d-models';
import { TSHIRT_FIT, resolveTShirtFit } from '@/components/studio/print-3d/t-shirt-fit';
import { composeShirtPrintTexture } from '@/components/studio/print-3d/t-shirt-print-composite';
import { createShirtGeometryForFit } from '@/components/studio/print-3d/t-shirt-women-deform';
import { TSHIRT_LOOK } from '@/components/studio/print-3d/t-shirt-look';

export const SHIRT_BAKED_GLB = '/models/print/shirt_baked.glb';

type ShirtGltf = {
  nodes: {
    T_Shirt_male: THREE.Mesh;
  };
  materials: {
    lambert1: THREE.MeshLambertMaterial;
  };
};

type TShirtProps = {
  params: NonNullable<Print3DModelConfig['procedural']['params']>;
  map?: THREE.Texture;
};

function useShirtGeometry(nodes: ShirtGltf['nodes'], fit: ReturnType<typeof resolveTShirtFit>) {
  return useMemo(
    () => createShirtGeometryForFit(nodes.T_Shirt_male.geometry, fit),
    [fit, nodes.T_Shirt_male.geometry],
  );
}

/**
 * White fabric; when a print is set, image is painted on the UV atlas first and
 * fold AO / normals wrinkle it in the shader (not a floating decal).
 */
function useShirtMaterial(
  source: THREE.MeshLambertMaterial,
  geometry: THREE.BufferGeometry,
  printMap: THREE.Texture | undefined,
  fabricColor: string,
  fit: ReturnType<typeof resolveTShirtFit>,
) {
  const { material: look } = TSHIRT_LOOK;
  const foldMap = source.aoMap ?? source.map;
  const placement = TSHIRT_FIT[fit].print;

  return useMemo(() => {
    let fabricMap: THREE.CanvasTexture | undefined;
    const printImage = printMap?.image as CanvasImageSource | undefined;
    const foldImage = (foldMap?.image ?? null) as CanvasImageSource | null;
    const hasPrint = Boolean(printImage);

    if (printImage) {
      const ready =
        printImage instanceof HTMLImageElement
          ? printImage.complete && printImage.naturalWidth > 0
          : true;
      if (ready) {
        fabricMap = composeShirtPrintTexture(
          geometry,
          printImage,
          fabricColor,
          placement,
          foldImage,
          look.printWrinkleMultiply,
        );
      }
    }

    return new THREE.MeshStandardMaterial({
      color: hasPrint ? '#ffffff' : fabricColor,
      map: fabricMap,
      roughness: hasPrint ? look.printRoughness : look.roughness,
      metalness: look.metalness,
      aoMap: hasPrint ? undefined : (foldMap ?? undefined),
      aoMapIntensity: look.foldStrength,
      normalMap: source.normalMap ?? undefined,
      normalScale: new THREE.Vector2(look.normalScale, look.normalScale),
      emissive: fabricColor,
      emissiveIntensity: hasPrint ? look.printEmissiveIntensity : look.emissiveIntensity,
      side: THREE.DoubleSide,
    });
  }, [
    fabricColor,
    fit,
    foldMap,
    geometry,
    look.emissiveIntensity,
    look.foldStrength,
    look.metalness,
    look.normalScale,
    look.printEmissiveIntensity,
    look.printRoughness,
    look.printWrinkleMultiply,
    look.roughness,
    placement,
    printMap,
    source.normalMap,
  ]);
}

function TShirtLights() {
  const { lights } = TSHIRT_LOOK;

  return (
    <>
      <ambientLight intensity={lights.ambient} />
      <hemisphereLight
        args={[lights.hemisphere.sky, lights.hemisphere.ground, lights.hemisphere.intensity]}
      />
      <directionalLight position={lights.key.position} intensity={lights.key.intensity} />
      <directionalLight position={lights.fill.position} intensity={lights.fill.intensity} />
      <directionalLight position={lights.back.position} intensity={lights.back.intensity} />
      <directionalLight position={lights.rim.position} intensity={lights.rim.intensity} />
    </>
  );
}

function TShirtModel({ params, map }: TShirtProps) {
  const { nodes, materials } = useGLTF(SHIRT_BAKED_GLB) as unknown as ShirtGltf;
  const fit = resolveTShirtFit(params.shirtFit);
  const fitConfig = TSHIRT_FIT[fit];
  const geometry = useShirtGeometry(nodes, fit);
  const fabricColor = params.color ?? TSHIRT_LOOK.color;
  const fabricMaterial = useShirtMaterial(
    materials.lambert1,
    geometry,
    map,
    fabricColor,
    fit,
  );

  useEffect(() => {
    return () => {
      fabricMaterial.map?.dispose();
      fabricMaterial.dispose();
      geometry.dispose();
    };
  }, [fabricMaterial, geometry]);

  return (
    <>
      <TShirtLights />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <Center>
        <mesh geometry={geometry} material={fabricMaterial} scale={fitConfig.meshScale} dispose={null} />
      </Center>
    </>
  );
}

export function TShirt(props: TShirtProps) {
  return <TShirtModel {...props} />;
}

useGLTF.preload(SHIRT_BAKED_GLB);
