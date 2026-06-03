import Box from '@mui/material/Box';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export function PageContainer({ children, maxWidth = 1280 }: PageContainerProps) {
  return (
    <Box
      component="main"
      sx={{
        px: { xs: 2.5, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
        pb: { xs: 6, md: 8 },
        maxWidth,
        mx: 'auto',
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
}
