import Typography from '@mui/material/Typography';
import { colors } from '@/theme/colors';

interface ProductSizeLabelProps {
  size: string;
  variant?: 'card' | 'inline';
}

export function ProductSizeLabel({ size, variant = 'card' }: ProductSizeLabelProps) {
  return (
    <Typography
      variant="caption"
      component="span"
      sx={{
        display: 'block',
        fontWeight: 600,
        letterSpacing: variant === 'inline' ? 0 : '0.02em',
        color: variant === 'inline' ? colors.text.secondary : colors.primary.main,
        mb: variant === 'card' ? 0.5 : 0,
      }}
    >
      {size}
    </Typography>
  );
}
