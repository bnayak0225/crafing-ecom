import Box from '@mui/material/Box';
import { Suspense } from 'react';
import { ActiveSidebar } from '@/components/client/ActiveSidebar';
import { StudioMainHeader } from '@/components/studio/StudioMainHeader';
import { apiServer } from '@/lib/api-server';
import { tokens } from '@/theme/tokens';

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    user = await apiServer.getUser();
  } catch {
    user = null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: `calc(100vh - ${tokens.siteNavbarHeight}px)`,
        overflow: 'hidden',
        minWidth: 0,
        bgcolor: 'background.default',
      }}
    >
      <Suspense fallback={null}>
        <ActiveSidebar />
      </Suspense>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <StudioMainHeader user={user} />
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}
