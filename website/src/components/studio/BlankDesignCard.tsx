'use client';

import { useState } from 'react';
import CropFreeOutlinedIcon from '@mui/icons-material/CropFreeOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import { ProductSizeLabel } from '@/components/studio/ProductSizeLabel';
import { formatStudioProductSize } from '@/config/studio-product-sizes';
import { getStudioProduct } from '@/config/studio-nav';
import { CrafingAuthError, crafingGraphql } from '@/lib/crafing-graphql';
import { openEditor } from '@/lib/editor-client';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

const PRODUCT_CARD_WIDTH = 200;

const customProduct = getStudioProduct('custom-size');

export function BlankDesignCard() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const work = await crafingGraphql.createBlankWork({ name: 'Untitled' });
      openEditor({ workId: work.id, title: work.name });
    } catch (err) {
      if (err instanceof CrafingAuthError) {
        window.location.href = '/login';
        return;
      }
      console.error('Failed to create blank design', err);
    } finally {
      setLoading(false);
    }
  };

  if (!customProduct) return null;

  const size = formatStudioProductSize(customProduct);

  return (
    <Card
      sx={{
        width: PRODUCT_CARD_WIDTH,
        minHeight: 196,
        bgcolor: colors.background.paper,
        border: 1,
        borderStyle: 'dashed',
        borderColor: colors.border.strong,
        '&:hover': {
          borderColor: colors.primary.main,
        },
      }}
    >
      <CardActionArea
        onClick={handleCreate}
        disabled={loading}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          p: 2.5,
          height: '100%',
          minHeight: 196,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: tokens.radiusPx.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: colors.accent.highlight,
            color: colors.primary.main,
            mb: 1.5,
          }}
        >
          <CropFreeOutlinedIcon sx={{ fontSize: 26 }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          {loading ? 'Creating…' : customProduct.label}
        </Typography>
        {size ? <ProductSizeLabel size={size} /> : null}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {customProduct.description ?? 'Start from a blank canvas.'}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
