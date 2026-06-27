/**
 * Configurable 3D product registry for the print studio.
 *
 * Replace any product preview with an authored GLB/GLTF:
 * 1. Put the file in `website/public/models/print/` (or any CDN URL)
 * 2. Set `gltf.url` on that product entry below
 * 3. Tune `gltf.scale`, `position`, `rotation` until it fits the scene
 *
 * When `gltf` is omitted, a procedural Three.js mesh is used as fallback.
 */

export type Print3DProceduralKind =
  | 'coffee-mug'
  | 'travel-mug'
  | 'picture-frame'
  | 'canvas-print'
  | 'poster-frame'
  | 't-shirt';

export type CoffeeMugWrapTheme = 'space' | 'nature' | 'company-logo';

export type Print3DProceduralParams = {
  bodyRadius?: number;
  bodyHeight?: number;
  handleRadius?: number;
  metalness?: number;
  roughness?: number;
  /** Accent / body color when no texture */
  color?: string;
  /** Coffee mug lip: `true` = flat extruded ring, `false` = rounded torus ring */
  extrudedLip?: boolean;
  /** Coffee mug body wrap artwork */
  wrapTheme?: CoffeeMugWrapTheme;
  /** T-shirt body silhouette — men's or women's fit */
  shirtFit?: 'men' | 'women';
};

export type Print3DGltfConfig = {
  /** e.g. `/models/print/coffee-mug.glb` or `https://cdn.example.com/models/mug.glb` */
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

export type Print3DModelConfig = {
  id: string;
  label: string;
  procedural: {
    kind: Print3DProceduralKind;
    params?: Print3DProceduralParams;
  };
  /** When set, loads this GLTF/GLB instead of the procedural mesh */
  gltf?: Print3DGltfConfig;
  camera: {
    position: [number, number, number];
    fov?: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

/** Per print product — keyed by `StudioProduct.id` */
export const PRINT_PRODUCT_3D_MODELS: Record<string, Print3DModelConfig> = {
  'coffee-mug': {
    id: 'coffee-mug',
    label: 'Coffee mug',
    procedural: {
      kind: 'coffee-mug',
      params: {
        bodyRadius: 0.5,
        bodyHeight: 1.0,
        roughness: 0.16,
        metalness: 0.01,
        color: '#ffffff',
        extrudedLip: false,
        wrapTheme: 'space',
      },
    },
    // gltf: { url: '/models/print/coffee-mug.glb', scale: 1 },
    camera: { position: [0.05, 0.38, 2.55], fov: 40 },
    autoRotate: true,
    autoRotateSpeed: 1.4,
  },
  'travel-mug': {
    id: 'travel-mug',
    label: 'Travel mug',
    procedural: {
      kind: 'travel-mug',
      params: {
        bodyRadius: 0.46,
        bodyHeight: 1.35,
        roughness: 0.3,
        metalness: 0.02,
        color: '#ffffff',
      },
    },
    // gltf: { url: '/models/print/travel-mug.glb', scale: 1 },
    camera: { position: [0.05, 0.48, 2.65], fov: 38 },
    autoRotate: true,
    autoRotateSpeed: 1.2,
  },
  't-shirt-men': {
    id: 't-shirt-men',
    label: "Men's T-shirt",
    procedural: {
      kind: 't-shirt',
      params: {
        shirtFit: 'men',
        color: '#ffffff',
        roughness: 0,
        metalness: 0,
      },
    },
    camera: { position: [0, 0, 2.15], fov: 25 },
    autoRotate: true,
    autoRotateSpeed: 1.1,
  },
  't-shirt-women': {
    id: 't-shirt-women',
    label: "Women's T-shirt",
    procedural: {
      kind: 't-shirt',
      params: {
        shirtFit: 'women',
        color: '#ffffff',
        roughness: 0.88,
        metalness: 0,
      },
    },
    camera: { position: [0, 0, 2.12], fov: 25 },
    autoRotate: true,
    autoRotateSpeed: 1.1,
  },
  'picture-frame': {
    id: 'picture-frame',
    label: 'Picture frame',
    procedural: { kind: 'picture-frame', params: { color: '#3d3228' } },
    // gltf: { url: '/models/print/picture-frame.glb', scale: 1 },
    camera: { position: [0, 0, 2.8], fov: 40 },
    autoRotate: true,
    autoRotateSpeed: 0.8,
  },
  'canvas-print': {
    id: 'canvas-print',
    label: 'Canvas print',
    procedural: { kind: 'canvas-print', params: { color: '#eceff3' } },
    // gltf: { url: '/models/print/canvas-print.glb', scale: 1 },
    camera: { position: [0.3, 0.1, 2.6], fov: 40 },
    autoRotate: true,
    autoRotateSpeed: 0.75,
  },
  'poster-frame': {
    id: 'poster-frame',
    label: 'Poster frame',
    procedural: { kind: 'poster-frame', params: { color: '#2a2a2e' } },
    // gltf: { url: '/models/print/poster-frame.glb', scale: 1 },
    camera: { position: [0, 0.1, 3.1], fov: 38 },
    autoRotate: true,
    autoRotateSpeed: 0.75,
  },
};

export function getPrint3DModelConfig(productId: string): Print3DModelConfig | undefined {
  return PRINT_PRODUCT_3D_MODELS[productId];
}

export function getDefaultPrint3DModelForProducts(productIds: string[]): Print3DModelConfig | undefined {
  for (const id of productIds) {
    const config = PRINT_PRODUCT_3D_MODELS[id];
    if (config) return config;
  }
  return undefined;
}

/** Deep-merge overrides — useful for env-specific GLTF paths later */
export function mergePrint3DModelConfig(
  base: Print3DModelConfig,
  overrides: Partial<Print3DModelConfig>,
): Print3DModelConfig {
  return {
    ...base,
    ...overrides,
    procedural: {
      ...base.procedural,
      ...overrides.procedural,
      params: { ...base.procedural.params, ...overrides.procedural?.params },
    },
    gltf: overrides.gltf ?? base.gltf,
    camera: { ...base.camera, ...overrides.camera },
  };
}
