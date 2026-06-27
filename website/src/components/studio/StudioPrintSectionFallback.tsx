import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

export function StudioPrintSectionFallback() {
  return (
    <Stack spacing={5}>
      <Box
        sx={{
          height: 220,
          borderRadius: tokens.radiusPx.lg,
          border: 1,
          borderColor: colors.border.subtle,
          bgcolor: colors.background.paper,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CircularProgress size={28} />
      </Box>
      {[0, 1].map((key) => (
        <Box
          key={key}
          sx={{
            minHeight: 320,
            borderRadius: tokens.radiusPx.lg,
            border: 1,
            borderColor: colors.border.subtle,
            bgcolor: colors.background.paper,
          }}
        />
      ))}
    </Stack>
  );
}
