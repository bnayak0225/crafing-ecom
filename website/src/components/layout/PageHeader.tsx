import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { colors } from '@/theme/colors';

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  compact?: boolean;
}

export function PageHeader({ eyebrow, title, description, compact }: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: compact ? 3 : 4,
        pt: compact ? 0.5 : 0,
        pb: compact ? 0 : 1,
      }}
    >
      {eyebrow && (
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            mb: 1,
            color: colors.primary.main,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant={compact ? 'h4' : 'h3'}
        component="h1"
        sx={{
          mb: description ? 1.25 : 0,
          maxWidth: 720,
          color: colors.text.primary,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body1"
          sx={{
            maxWidth: 560,
            lineHeight: 1.65,
            color: colors.text.secondary,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
