import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

interface BrandLogoProps {
  href?: string;
  size?: 'sm' | 'md';
}

export function BrandLogo({ href = '/studio', size = 'md' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 32 : 40;
  const variant = size === 'sm' ? 'subtitle1' : 'h6';

  const content = (
    <>
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: tokens.radiusPx.md,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          fontWeight: 700,
          fontSize: size === 'sm' ? '1rem' : '1.125rem',
          color: colors.primary.contrast,
          bgcolor: colors.primary.main,
          boxShadow: colors.shadow.logo,
        }}
      >
        C
      </Box>
      <Typography
        variant={variant}
        sx={{
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          color: colors.text.primary,
        }}
      >
        Cafing Studio
      </Typography>
    </>
  );

  if (!href) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>{content}</Box>
    );
  }

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>{content}</Box>
    </Link>
  );
}
