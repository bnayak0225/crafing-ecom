import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { components } from './components';
import { palette } from './palette';
import { tokens } from './tokens';
import { typography } from './typography';

declare module '@mui/material/styles' {
  interface Theme {
    tokens: typeof tokens;
    colors: typeof colors;
  }
  interface ThemeOptions {
    tokens?: typeof tokens;
    colors?: typeof colors;
  }
}

export const theme = createTheme({
  palette,
  typography,
  components,
  shape: { borderRadius: tokens.radius.md },
  tokens,
  colors,
});
