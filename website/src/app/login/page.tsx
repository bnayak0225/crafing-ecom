'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.login(email, password);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('cafing_demo_token', res.token);
        window.localStorage.setItem('cafing_demo_user', JSON.stringify(res.user));
      }
      router.push('/studio');
      router.refresh();
    } catch {
      setError('Could not sign in. Is the API running on port 3001?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        py: 6,
        background: colors.gradient.heroBase,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
            Sign in to Cafing Studio
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, textAlign: 'center' }}>
            Demo login — use <strong>alex@example.com</strong> and any password.
          </Typography>
        </Stack>

        <Card sx={{ borderRadius: tokens.radiusPx.lg }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoComplete="current-password"
                />
                <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
                <Typography variant="body2" sx={{ textAlign: 'center', color: colors.text.secondary }}>
                  No account?{' '}
                  <Typography component={Link} href="/studio/pricing" variant="body2" sx={{ fontWeight: 600 }}>
                    View plans
                  </Typography>
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          <Link href="/" style={{ color: colors.primary.main, fontWeight: 600 }}>
            ← Back to home
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
