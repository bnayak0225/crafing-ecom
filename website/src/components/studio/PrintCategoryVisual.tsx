'use client';

import Box from '@mui/material/Box';
import Image from 'next/image';
import { Print3DViewer } from '@/components/studio/print-3d/Print3DViewer';
import type { PrintCategory } from '@/config/print-categories';
import type { Print3DModelConfig } from '@/config/print-3d-models';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

type PrintCategoryVisualProps = {
  category: PrintCategory;
  modelConfig?: Print3DModelConfig;
};

export function PrintCategoryVisual({ category, modelConfig }: PrintCategoryVisualProps) {
  const frameSx = {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    minHeight: { xs: 300, md: 380 },
    borderRadius: tokens.radiusPx.lg,
    background: colors.gradient.surfaceGlow,
    border: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  };

  return (
    <Box sx={frameSx}>
      {category.previewImage ? (
        <Image
          src={category.previewImage}
          alt={`${category.title} preview`}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority={category.id === 'photobook' || category.id === 'frame' || category.id === 'photo-print'}
        />
      ) : modelConfig ? (
        <Box sx={{ position: 'absolute', inset: 0 }}>
          <Print3DViewer config={modelConfig} />
        </Box>
      ) : null}
    </Box>
  );
}
