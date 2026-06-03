import Box from '@mui/material/Box';
import { ActiveSidebar } from '@/components/client/ActiveSidebar';
import { Topbar } from '@/components/Topbar';
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ActiveSidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: `${tokens.sidebarWidth}px` },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Topbar user={user} />
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
