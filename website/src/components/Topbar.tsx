import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { User } from '@/types';
import { colors } from '@/theme/colors';

interface TopbarProps {
  user: User | null;
}

/** User / plan strip for the studio main column header. */
export function Topbar({ user }: TopbarProps) {
  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
      <Chip
        label={user.plan.toUpperCase()}
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: '0.6875rem',
          letterSpacing: '0.06em',
          bgcolor: colors.accent.highlight,
          color: colors.secondary.dark,
          border: '1px solid',
          borderColor: colors.accent.highlightBorder,
        }}
      />
      <Avatar src={user.avatar} alt={user.name} sx={{ width: 38, height: 38 }} />
    </Box>
  );
}
