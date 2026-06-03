'use client';

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiClient } from '@/lib/api-client';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';
import type { CartItem, CartSummary } from '@/types';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .getCart()
      .then((res) => {
        setItems(res.data);
        setSummary(res.summary);
      })
      .catch(() => setError('Could not load cart. Start the API on port 3001.'));
  }, []);

  return (
    <PageContainer maxWidth={800}>
      <PageHeader
        title="Cart"
        description="Premium templates and add-ons ready for checkout."
        compact
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && items.length === 0 && (
        <Alert severity="info">Your cart is empty.</Alert>
      )}

      {items.length > 0 && summary && (
        <Stack spacing={3}>
          <Stack spacing={2}>
            {items.map((item) => (
              <Card key={item.id} sx={{ overflow: 'hidden' }}>
                <Stack direction="row" spacing={2} sx={{ p: 2, alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    image={item.thumbnail}
                    alt={item.title}
                    sx={{
                      width: 88,
                      height: 66,
                      borderRadius: tokens.radiusPx.sm,
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
                      {item.title}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                      <Chip label={item.type.replace('_', ' ')} size="small" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        Qty {item.quantity}
                      </Typography>
                    </Stack>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, flexShrink: 0 }}>
                    {formatMoney(item.price * item.quantity, summary.currency)}
                  </Typography>
                  <IconButton size="small" aria-label="Remove" disabled>
                    <DeleteOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Card>
            ))}
          </Stack>

          <Card sx={{ p: 3, bgcolor: colors.background.subtle }}>
            <Stack spacing={1.5}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>{formatMoney(summary.subtotal, summary.currency)}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax (demo 8%)</Typography>
                <Typography>{formatMoney(summary.tax, summary.currency)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {formatMoney(summary.total, summary.currency)}
                </Typography>
              </Stack>
              <Button variant="contained" color="primary" size="large" sx={{ mt: 1 }}>
                Checkout (demo)
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                Dummy cart — checkout does not process real payments.
              </Typography>
            </Stack>
          </Card>
        </Stack>
      )}
    </PageContainer>
  );
}
