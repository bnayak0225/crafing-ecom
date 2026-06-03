import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Toolbar from '@mui/material/Toolbar';
import type { User } from '@/types';
import { SearchForm } from '@/components/client/SearchForm';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

interface TopbarProps {
  user: User | null;
}

export function Topbar({ user }: TopbarProps) {
  return (
    <AppBar position="sticky" color="default">
      <Toolbar
        sx={{
          gap: 2,
          minHeight: tokens.headerHeight,
          px: { xs: 2, md: 3 },
        }}
      >
        <SearchForm />
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
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
        )}
      </Toolbar>
    </AppBar>
  );
}
