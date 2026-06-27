import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TemplateGrid } from '@/components/TemplateGrid';
import { colors } from '@/theme/colors';
import type { Template } from '@/types';

interface FeaturedThemesSectionProps {
  templates: Template[];
}

export function FeaturedThemesSection({ templates }: FeaturedThemesSectionProps) {
  if (templates.length === 0) return null;

  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          Featured themes
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.secondary }}>
          Start from a popular template — open any preview in the editor.
        </Typography>
      </Stack>
      <TemplateGrid templates={templates} />
    </Stack>
  );
}
