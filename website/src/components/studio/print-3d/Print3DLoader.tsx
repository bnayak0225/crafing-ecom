'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/material/styles';
import { colors } from '@/theme/colors';

const dotBounce = keyframes`
  0%, 70%, 100% {
    transform: translateY(0) scale(0.85);
    opacity: 0.45;
  }
  35% {
    transform: translateY(-12px) scale(1.05);
    opacity: 1;
  }
`;

const ringSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

const DOT_COLORS = [colors.primary.light, colors.primary.main, colors.secondary.main] as const;

type Print3DLoaderProps = {
  /** When true, keeps the scene background visible under the spinner. */
  overBackground?: boolean;
};

/** Playful loader shown while 3D print previews initialize. */
export function Print3DLoader({ overBackground = false }: Print3DLoaderProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label="Loading 3D preview"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        pointerEvents: 'none',
        ...(overBackground
          ? { bgcolor: 'transparent' }
          : {
              bgcolor: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(6px)',
            }),
      }}
    >
      <Box sx={{ position: 'relative', width: 56, height: 56 }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: colors.primary.main,
            borderRightColor: colors.secondary.main,
            animation: `${ringSpin} 1.1s linear infinite`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
          }}
        >
          {DOT_COLORS.map((color, index) => (
            <Box
              key={color}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: color,
                animation: `${dotBounce} 0.9s ease-in-out infinite`,
                animationDelay: `${index * 0.14}s`,
              }}
            />
          ))}
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background: colors.gradient.brand,
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: `${shimmer} 2.4s linear infinite`,
        }}
      >
        Loading preview
      </Typography>
    </Box>
  );
}
