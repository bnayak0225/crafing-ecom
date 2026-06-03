/**
 * Cafing Studio — single color source.
 * All hex/rgba values live here only. Import `colors` in theme + components.
 *
 * Brand gradient: cyan → violet → magenta (see `gradient.brand`).
 *
 * WCAG 2.1 AA (on white #FFFFFF):
 * - text.primary #12141C ~16:1
 * - text.secondary #4B4E53 ~7.8:1
 * - primary.contrast on primary.main #5F61F2 ~4.6:1
 */

const raw = {
  white: '#FFFFFF',
  canvas: '#F4F6F9',
  paperSubtle: '#EFF6FF',
  paperMuted: '#E8EEF8',
  mist: '#F8FAFC',
  sky50: '#F0F7FF',
  brandCyan: '#04DDED',
  brandViolet: '#5F61F2',
  brandMagenta: '#9628B3',
  ink900: '#12141C',
  ink700: '#4B4E53',
  ink500: '#6E7178',
  ink300: '#D4D5D8',
  ink200: '#E9EBEE',
  blue900: '#1E3A8A',
  blue800: '#1E40AF',
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  red900: '#991B1B',
  red800: '#B91C1C',
  red700: '#DC2626',
  red600: '#EF4444',
  red500: '#F87171',
  rose50: '#FFF1F2',
  roseMuted: '#FFE4E6',
  amber700: '#B45309',
  green700: '#0A7A12',
  chromeClose: '#E8574B',
  chromeMinimize: '#E5A028',
  chromeMaximize: '#2EAD6E',
} as const;

/** Brand violet — rgb(95, 97, 242) */
const alpha = {
  brand6: 'rgba(95, 97, 242, 0.06)',
  brand8: 'rgba(95, 97, 242, 0.08)',
  brand10: 'rgba(95, 97, 242, 0.1)',
  brand12: 'rgba(95, 97, 242, 0.12)',
  brand16: 'rgba(95, 97, 242, 0.16)',
  brand20: 'rgba(95, 97, 242, 0.2)',
  brand28: 'rgba(95, 97, 242, 0.28)',
  cyan20: 'rgba(4, 221, 237, 0.22)',
  magenta20: 'rgba(150, 40, 179, 0.2)',
  white92: 'rgba(255, 255, 255, 0.92)',
  white7: 'rgb(255 255 255 / 7%)',
  ink35: 'rgba(18, 20, 28, 0.35)',
  ink6: 'rgba(64, 79, 109, 0.06)',
  ink8: 'rgba(64, 79, 109, 0.08)',
  ink14: 'rgba(57, 70, 96, 0.14)',
  gridLine: 'rgba(95, 97, 242, 0.06)',
} as const;

const brandGradient = `linear-gradient(135deg, ${raw.brandCyan} 0%, ${raw.brandViolet} 45%, ${raw.brandMagenta} 100%)`;

export const colors = {
  background: {
    default: raw.canvas,
    paper: raw.white,
    elevated: raw.white,
    subtle: raw.paperSubtle,
    muted: raw.paperMuted,
  },
  text: {
    primary: raw.ink900,
    secondary: raw.ink700,
    disabled: raw.ink500,
  },
  primary: {
    main: raw.brandViolet,
    light: raw.brandCyan,
    dark: raw.brandMagenta,
    contrast: raw.white,
  },
  secondary: {
    main: raw.brandMagenta,
    light: raw.red600,
    dark: raw.red800,
    contrast: raw.white,
  },
  accent: {
    highlight: raw.paperSubtle,
    highlightBorder: raw.roseMuted,
    pro: raw.red800,
    mint: raw.sky50,
    warm: raw.rose50,
  },
  chrome: {
    close: raw.chromeClose,
    minimize: raw.chromeMinimize,
    maximize: raw.chromeMaximize,
    bar: raw.paperMuted,
  },
  border: {
    subtle: raw.ink200,
    strong: raw.ink300,
    focus: raw.brandViolet,
  },
  divider: raw.ink200,
  common: {
    onDark: raw.white,
    onLight: raw.ink900,
  },
  state: {
    error: { main: raw.red800, contrast: raw.white },
    warning: { main: raw.amber700, contrast: raw.white },
    info: { main: raw.brandViolet, contrast: raw.white },
    success: { main: raw.green700, contrast: raw.white },
  },
  alpha,
  overlay: {
    scrim: alpha.ink35,
  },
  shadow: {
    card: `0 1px 2px ${alpha.ink6}, 0 4px 16px ${alpha.ink6}`,
    cardHover: `0 4px 8px ${alpha.ink8}, 0 12px 32px ${alpha.brand10}`,
    header: `0 1px 0 ${alpha.ink8}`,
    logo: `0 2px 8px ${alpha.brand28}`,
    heroPanel: `0 0 0 1px ${alpha.ink6}, 0 0 8px 0 ${alpha.ink14}, 0 24px 48px ${alpha.brand16}`,
    elevated: `0 0 0 0.5px ${alpha.ink6}, 0 8px 16px ${alpha.ink8}, 0 24px 24px ${alpha.ink14}`,
  },
  gradient: {
    brand: brandGradient,
    heroBase: `linear-gradient(180deg, ${raw.sky50} 0%, ${raw.mist} 55%, ${raw.white} 100%)`,
    heroAccent: brandGradient,
    heroText: brandGradient,
    sectionBand: `linear-gradient(90deg, ${raw.paperSubtle} 0%, ${raw.rose50} 100%)`,
    surfaceGlow: `linear-gradient(90deg, ${raw.paperSubtle}, ${raw.mist})`,
    ctaShine: `linear-gradient(120deg, ${alpha.white7} 0%, transparent 50%)`,
    brandBorder: brandGradient,
    mediaCaption: `linear-gradient(180deg, transparent 0%, rgba(18, 20, 28, 0.75) 100%)`,
    iconTile: `linear-gradient(135deg, ${raw.paperSubtle} 0%, ${raw.mist} 100%)`,
  },
} as const;

/** MUI palette mapping — built from `colors` only */
export const muiPalette = {
  mode: 'light' as const,
  primary: {
    main: colors.primary.main,
    light: colors.primary.light,
    dark: colors.primary.dark,
    contrastText: colors.primary.contrast,
  },
  secondary: {
    main: colors.secondary.main,
    light: colors.secondary.light,
    dark: colors.secondary.dark,
    contrastText: colors.secondary.contrast,
  },
  background: {
    default: colors.background.default,
    paper: colors.background.paper,
  },
  text: {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    disabled: colors.text.disabled,
  },
  divider: colors.divider,
  error: colors.state.error,
  warning: colors.state.warning,
  info: colors.state.info,
  success: colors.state.success,
};
