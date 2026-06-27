'use client';

import { Component, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Print3DLoader } from '@/components/studio/print-3d/Print3DLoader';
import { Print3DModel } from '@/components/studio/print-3d/Print3DModel';
import { Print3DSceneReady } from '@/components/studio/print-3d/Print3DSceneReady';
import { COFFEE_MUG_LOOK } from '@/components/studio/print-3d/coffee-mug-look';
import { TSHIRT_LOOK } from '@/components/studio/print-3d/t-shirt-look';
import type { CoffeeMugWrapTheme, Print3DModelConfig } from '@/config/print-3d-models';

type Print3DViewerProps = {
  config: Print3DModelConfig;
  mugWrapTheme?: CoffeeMugWrapTheme;
  shirtColor?: string;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class Print3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function PrintSceneLights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#ffffff', '#d8dee8', 0.45]} />
      <directionalLight position={[5, 8, 4]} intensity={1.15} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} />
    </>
  );
}

export function Print3DViewer({ config, mugWrapTheme, shirtColor }: Print3DViewerProps) {
  const kind = config.procedural.kind;
  const isTShirt = kind === 't-shirt';
  const isCoffeeMug = kind === 'coffee-mug';
  const sceneBackground = isTShirt
    ? TSHIRT_LOOK.sceneBackground
    : isCoffeeMug
      ? COFFEE_MUG_LOOK.sceneBackground
      : null;
  const shadow = isTShirt
    ? TSHIRT_LOOK.dropShadow
    : { y: -0.72, opacity: 0.4, scale: 9, blur: 2.4, far: 4 };
  const camera = useMemo(
    () => ({
      position: config.camera.position,
      fov: config.camera.fov ?? 42,
    }),
    [config],
  );

  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    setSceneReady(false);
  }, [config.id, sceneBackground, mugWrapTheme, shirtColor]);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  return (
    <Print3DErrorBoundary fallback={null}>
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {sceneBackground ? (
          <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image
              src={sceneBackground}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={isTShirt || isCoffeeMug}
            />
          </Box>
        ) : null}

        {!sceneReady ? (
          <Print3DLoader overBackground={Boolean(sceneBackground)} />
        ) : null}

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            opacity: sceneReady ? 1 : 0,
            visibility: sceneReady ? 'visible' : 'hidden',
            transition: 'opacity 0.4s ease',
            pointerEvents: sceneReady ? 'auto' : 'none',
          }}
        >
          <Canvas
            camera={camera}
            gl={{
              antialias: true,
              alpha: true,
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {!isTShirt ? <PrintSceneLights /> : null}
            <Suspense fallback={null}>
              <Print3DModel
                key={`${config.id}-${mugWrapTheme ?? ''}-${shirtColor ?? ''}`}
                config={config}
                mugWrapTheme={mugWrapTheme}
                shirtColor={shirtColor}
              />
              <Print3DSceneReady onReady={handleSceneReady} />
            </Suspense>
            <ContactShadows
              position={[0, shadow.y, 0]}
              opacity={shadow.opacity}
              scale={shadow.scale}
              blur={shadow.blur}
              far={shadow.far}
              color="#000000"
              resolution={512}
            />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              target={[0, 0, 0]}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.85}
              autoRotate={config.autoRotate ?? true}
              autoRotateSpeed={config.autoRotateSpeed ?? 1.2}
            />
          </Canvas>
        </Box>
      </Box>
    </Print3DErrorBoundary>
  );
}
