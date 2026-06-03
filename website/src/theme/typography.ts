import type { TypographyVariantsOptions } from '@mui/material/styles';
import { fontFamily } from './fonts';

export const typography: TypographyVariantsOptions = {
  fontFamily,
  h1: {
    fontWeight: 700,
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
  },
  h2: {
    fontWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
  },
  h3: {
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.25,
  },
  h4: {
    fontWeight: 600,
    letterSpacing: '-0.015em',
  },
  h5: {
    fontWeight: 600,
  },
  h6: {
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: '1.0625rem',
    lineHeight: 1.6,
    fontWeight: 400,
  },
  subtitle2: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '0.9375rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.8125rem',
    lineHeight: 1.55,
  },
  caption: {
    fontSize: '0.75rem',
    letterSpacing: '0.01em',
  },
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
  },
};
