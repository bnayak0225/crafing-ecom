import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FeaturedThemeCard } from '@/components/studio/FeaturedThemeCard';
import { getFeaturedThemes } from '@/config/featured-themes';
import type { StudioSection } from '@/config/studio-nav';
import { colors } from '@/theme/colors';

interface FeaturedThemesSectionProps {
  section: StudioSection;
}

export function FeaturedThemesSection({ section }: FeaturedThemesSectionProps) {
  const themes = getFeaturedThemes(section);

  if (themes.length === 0) return null;

  return (
    <Stack
      spacing={2}
      sx={{
        mt: 5,
        pt: 4,
        borderTop: 1,
        borderColor: colors.border.subtle,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          Top featured themes
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Popular design themes — theme name, template format, and page size.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        {themes.map((theme) => (
          <FeaturedThemeCard key={theme.id} theme={theme} />
        ))}
      </Box>
    </Stack>
  );
}
