import { colors } from './colors';

/** Layout & non-color design tokens. Colors: import `colors` from `@/theme/colors`. */
export const tokens = {
  sidebarWidth: 260,
  headerHeight: 72,
  /** Theme shape multiplier base — do not pass these numbers directly in `sx` borderRadius */
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 16,
  },
  /** Pixel radii for `sx` / inline styles (MUI multiplies unitless sx values) */
  radiusPx: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '16px',
  },
  /** @deprecated Use `colors` from `@/theme/colors` */
  palette: colors,
  /** @deprecated Use `colors.shadow` */
  shadows: colors.shadow,
} as const;
