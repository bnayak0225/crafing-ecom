import type { Metadata } from 'next';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TOOL_OPTIONS } from '@/components/tools/toolsConfig';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

export const metadata: Metadata = {
  title: 'Free image tools — Cafing Studio',
  description: 'Free online background remover and image resizer. No sign-in required.',
};

const TOOL_DETAILS: Record<(typeof TOOL_OPTIONS)[number]['path'], string> = {
  '/tools/remove-background':
    'Remove backgrounds and add color, gradient, or photo backdrops.',
  '/tools/resize-image':
    'Resize, crop by percent or pixels, and control JPEG/WebP quality.',
};

export default function ToolsIndexPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" sx={{ color: colors.primary.main, fontWeight: 700 }}>
              Free tools
            </Typography>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              Image tools
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Choose a tool below. Processed in memory — nothing saved to your account.
            </Typography>
          </Box>
          <Stack spacing={2}>
            {TOOL_OPTIONS.map((tool) => (
              <Box
                key={tool.path}
                sx={{
                  p: 3,
                  borderRadius: tokens.radiusPx.lg,
                  border: 1,
                  borderColor: colors.border.subtle,
                  bgcolor: colors.background.paper,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {tool.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {TOOL_DETAILS[tool.path]}
                </Typography>
                <Link href={tool.path} style={{ textDecoration: 'none' }}>
                  <Button variant="contained">Open tool</Button>
                </Link>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
