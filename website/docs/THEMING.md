# MUI theming

## Single color file

**All colors are defined in one place:**

```
src/theme/colors.ts
```

Do **not** use hex (`#…`) or `rgba(…)` literals in components, pages, or `components.ts`. Import semantic tokens instead:

```ts
import { colors } from '@/theme/colors';

// ✅
sx={{ bgcolor: colors.background.paper, color: colors.text.primary }}

// ❌
sx={{ bgcolor: '#FFFFFF', color: 'rgba(11, 110, 79, 0.06)' }}
```

### Structure

| Export | Purpose |
|--------|---------|
| `colors.background.*` | Canvas, cards, sections |
| `colors.text.*` | Primary / secondary / disabled copy |
| `colors.primary.*` | Brand blue (buttons, links) |
| `colors.secondary.*` | Red accent (Pro chips, gradient end) |
| `colors.gradient.*` | Hero / section backgrounds |
| `colors.border.*` | Borders and focus ring |
| `colors.alpha.*` | Transparent overlays (hover, header) |
| `colors.shadow.*` | Box-shadow strings |
| `colors.overlay.*` | Image scrims |
| `colors.common.*` | onDark / onLight icons |
| `muiPalette` | MUI `createTheme` mapping (internal) |

Layout-only tokens (width, radius): `src/theme/tokens.ts`

## Light theme

Studio light theme: edit all values in `src/theme/colors.ts` (`raw`, `alpha`, semantic groups, `gradient.*`).

## Customizing

1. Change values only in **`colors.ts`** (`raw` + `alpha` + semantic groups).
2. Re-check contrast: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
3. Run `npm run build`.
