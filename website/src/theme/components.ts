import type { Components, Theme } from '@mui/material/styles';
import { colors } from './colors';
import { tokens } from './tokens';

export const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: `${colors.border.strong} transparent`,
        backgroundColor: colors.background.default,
        color: colors.text.primary,
      },
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
      '::selection': {
        backgroundColor: colors.alpha.brand20,
        color: colors.text.primary,
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.md,
        padding: '10px 20px',
        fontWeight: 600,
      },
      sizeLarge: {
        padding: '12px 28px',
        fontSize: '0.9375rem',
      },
      outlined: {
        borderColor: colors.border.strong,
        color: colors.text.primary,
        backgroundColor: colors.background.paper,
        '&:hover': {
          borderColor: colors.primary.main,
          backgroundColor: colors.alpha.brand8,
        },
      },
    },
    variants: [
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrast,
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
      },
    ],
  },
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.lg,
        border: 'none',
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        boxShadow: 'none',
        transition: 'transform 0.25s ease',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.sm,
        fontWeight: 500,
        fontSize: '0.8125rem',
        height: 32,
      },
      filled: {
        backgroundColor: colors.primary.main,
        color: colors.primary.contrast,
      },
      outlined: {
        borderColor: colors.border.strong,
        backgroundColor: colors.background.paper,
        color: colors.text.primary,
        '&:hover': {
          backgroundColor: colors.alpha.brand8,
          borderColor: colors.primary.main,
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: { size: 'small' },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: tokens.radius.md,
          backgroundColor: colors.background.paper,
          '& fieldset': {
            borderColor: colors.border.strong,
          },
          '&:hover fieldset': {
            borderColor: colors.text.disabled,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.border.focus,
            borderWidth: 2,
          },
        },
      },
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'default' },
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${colors.border.subtle}`,
        boxShadow: colors.shadow.header,
        backdropFilter: 'blur(12px)',
        backgroundColor: colors.alpha.white92,
        color: colors.text.primary,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        width: tokens.sidebarWidth,
        borderRight: `1px solid ${colors.border.subtle}`,
        backgroundColor: colors.background.elevated,
        backgroundImage: 'none',
        boxShadow: 'none',
        color: colors.text.primary,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.md,
        marginBottom: 2,
        paddingTop: 10,
        paddingBottom: 10,
        color: colors.text.secondary,
        '&:hover': {
          backgroundColor: colors.background.subtle,
          color: colors.text.primary,
        },
        '&.Mui-selected': {
          backgroundColor: colors.alpha.brand8,
          color: colors.primary.dark,
          fontWeight: 600,
          '&:hover': {
            backgroundColor: colors.alpha.brand12,
          },
          '& .MuiListItemIcon-root': {
            color: colors.primary.main,
          },
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 40,
        color: 'inherit',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        border: `2px solid ${colors.border.subtle}`,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: tokens.radius.md,
        border: `1px solid ${colors.border.subtle}`,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: colors.border.subtle,
      },
    },
  },
};
