/**
 * T-shirt studio look — tweak values here to adjust fold shadows, lighting, and ground shadow.
 *
 * Fold depth: raise `foldStrength` for darker creases; lower `lights.ambient` if folds wash out.
 * Raise `emissiveIntensity` if the shirt looks too dark on first load.
 */
export const TSHIRT_LOOK = {
  /** Lifestyle scene behind the transparent WebGL canvas. */
  sceneBackground: '/images/print/tshirt-boutique-bg.png',

  /** Swatches shown in the studio preview color picker. */
  fabricColors: [
    { id: 'white', label: 'White', hex: '#ffffff' },
    { id: 'red', label: 'Red', hex: '#dc2626' },
    { id: 'black', label: 'Black', hex: '#171717' },
    { id: 'blue', label: 'Blue', hex: '#2563eb' },
    { id: 'yellow', label: 'Yellow', hex: '#eab308' },
  ] as const,

  /** Base fabric color (overridden by preview picker / `params.color`). */
  color: '#ffffff',

  material: {
    /**
     * Baked crease shading on plain white fabric (no print).
     * 0 = flat white, ~1 = full fold depth from the model bake.
     * Keep moderate — high values grey out the back when the shirt rotates.
     */
    foldStrength: 0.42,
    /**
     * When a chest print is present, wrinkles are baked into the UV canvas (multiply).
     * Lower = brighter print; higher = more crease on the artwork.
     */
    printWrinkleMultiply: 0.25,
    /** Matte fabric without print. */
    roughness: 0.92,
    /** Slightly less matte when printed so inks look vivid. */
    printRoughness: 0.78,
    metalness: 0,
    /** Soft white fill so fabric stays bright on back faces during orbit. */
    emissiveIntensity: 0.16,
    printEmissiveIntensity: 0,
    normalScale: 0.55,
  },

  lights: {
    /** Lower = more contrast in folds; higher = flatter white shirt. */
    ambient: 0.48,
    hemisphere: {
      sky: '#ffffff',
      ground: '#eef1f6',
      intensity: 0.42,
    },
    key: {
      position: [4.5, 7, 5.5] as const,
      intensity: 0.78,
    },
    fill: {
      position: [-3.5, 3.5, -4.5] as const,
      intensity: 0.48,
    },
    /** Behind the shirt — keeps the back panel white when orbiting. */
    back: {
      position: [0, 4, -7] as const,
      intensity: 0.62,
    },
    /** Rim light — separates sleeves and side folds. */
    rim: {
      position: [0, 2, -6] as const,
      intensity: 0.28,
    },
  },

  /** Contact shadow under the shirt hem — tune in t-shirt-look.ts */
  dropShadow: {
    opacity: 0.68,
    scale: 10,
    y: -0.72,
    blur: 2.6,
    far: 5,
  },
} as const;

export type TShirtFabricColorId = (typeof TSHIRT_LOOK.fabricColors)[number]['id'];

export function getTShirtFabricColorHex(id: TShirtFabricColorId): string {
  return TSHIRT_LOOK.fabricColors.find((swatch) => swatch.id === id)?.hex ?? TSHIRT_LOOK.color;
}
