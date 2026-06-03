'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiClient } from '@/lib/api-client';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';
import type { Order, Project, User } from '@/types';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const statusColor: Record<Order['status'], 'success' | 'warning' | 'default' | 'error'> = {
  completed: 'success',
  processing: 'warning',
  cancelled: 'default',
  refunded: 'error',
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    Promise.all([apiClient.getUser(), apiClient.getOrders(), apiClient.getProjects()]).then(
      ([u, ord, proj]) => {
        setUser(u);
        setOrders(ord.data);
        setProjects(proj.data);
      },
    );
  }, []);

  if (!user) {
    return (
      <PageContainer maxWidth={800}>
        <PageHeader title="Account" description="Loading profile…" compact />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth={800}>
      <PageHeader
        title="Account"
        description="Profile, billing, and order history (demo data)."
        compact
      />

      <Card sx={{ mb: 3, bgcolor: colors.background.subtle }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ alignItems: { sm: 'center' } }}>
            <Avatar src={user.avatar} alt={user.name} sx={{ width: 72, height: 72 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              {user.role && user.company && (
                <Typography variant="body2" sx={{ mt: 0.5, color: colors.text.secondary }}>
                  {user.role} · {user.company}
                </Typography>
              )}
            </Box>
            <Chip label={user.planLabel || user.plan.toUpperCase()} color="primary" />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Member since
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatDate(user.memberSince || user.createdAt)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user.phone || '—'}
              </Typography>
            </Grid>
            {user.billing && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  Billing address
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.billing.address}, {user.billing.city} {user.billing.postalCode},{' '}
                  {user.billing.country}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Order history
      </Typography>
      <Stack spacing={2} sx={{ mb: 4 }}>
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 1.5 }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {order.id.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(order.createdAt)} · {order.paymentMethod}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Chip label={order.status} size="small" color={statusColor[order.status]} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {formatMoney(order.total, order.currency)}
                  </Typography>
                </Stack>
              </Stack>
              {order.items.map((item, idx) => (
                <Typography key={idx} variant="body2" color="text.secondary">
                  {item.quantity}× {item.title} — {formatMoney(item.price, order.currency)}
                </Typography>
              ))}
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Recent designs
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        {projects.length} projects in your workspace
      </Typography>
      <Typography variant="body2">
        <Link href="/studio/projects" style={{ color: colors.primary.main, fontWeight: 600 }}>
          View all projects →
        </Link>
      </Typography>
    </PageContainer>
  );
}
