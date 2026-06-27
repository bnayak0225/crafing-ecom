'use client';

import Box from '@mui/material/Box';
import { SearchForm } from '@/components/client/SearchForm';
import { Topbar } from '@/components/Topbar';
import type { User } from '@/types';
import { colors } from '@/theme/colors';

type StudioMainHeaderProps = {
  user: User | null;
};

/** Search + user row — only in the studio main (right) column. */
export function StudioMainHeader({ user }: StudioMainHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        gap: 2,
        px: { xs: 2, md: 3 },
        py: 2,
        borderBottom: 1,
        borderColor: colors.border.subtle,
        bgcolor: colors.alpha.white92,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <SearchForm />
      </Box>
      <Topbar user={user} />
    </Box>
  );
}
