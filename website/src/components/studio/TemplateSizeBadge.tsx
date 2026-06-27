import Chip from '@mui/material/Chip';
import { colors } from '@/theme/colors';

interface TemplateSizeBadgeProps {
  width: number;
  height: number;
  position?: 'overlay' | 'inline';
}

export function formatTemplateSize(width: number, height: number): string {
  return `${width.toLocaleString()} × ${height.toLocaleString()}`;
}

export function TemplateSizeBadge({
  width,
  height,
  position = 'overlay',
}: TemplateSizeBadgeProps) {
  const label = formatTemplateSize(width, height);

  if (position === 'inline') {
    return (
      <Chip
        label={label}
        size="small"
        variant="outlined"
        sx={{ height: 24, fontWeight: 600, fontSize: '0.6875rem' }}
      />
    );
  }

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        position: 'absolute',
        left: 10,
        bottom: 10,
        height: 24,
        fontWeight: 700,
        fontSize: '0.6875rem',
        bgcolor: colors.overlay.scrim,
        color: colors.common.onDark,
        backdropFilter: 'blur(4px)',
      }}
    />
  );
}
