'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { PrintCategoryVisual } from '@/components/studio/PrintCategoryVisual';
import { PRINT_CATEGORIES, printCategoryHref } from '@/config/print-categories';
import {
  getDefaultPrint3DModelForProducts,
} from '@/config/print-3d-models';
import { listStudioPrintProducts } from '@/config/studio-nav';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

export function StudioPrintExperience() {
  return (
    <Stack spacing={{ xs: 5, md: 6 }}>
      {PRINT_CATEGORIES.map((category, index) => {
        const products = listStudioPrintProducts().filter(
          (product) => product.printGroupId === category.id,
        );
        const productIds = products.map((product) => product.id);
        const modelConfig = getDefaultPrint3DModelForProducts(productIds);

        if (!modelConfig && !category.previewImage) return null;

        return (
          <Box
            key={category.id}
            component="section"
            sx={{
              borderBottom: index < PRINT_CATEGORIES.length - 1 ? 1 : 0,
              borderColor: colors.border.subtle,
              pb: index < PRINT_CATEGORIES.length - 1 ? { xs: 5, md: 6 } : 0,
            }}
          >
            <Grid
              container
              spacing={{ xs: 3, md: 6 }}
              sx={{ alignItems: 'stretch' }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <PrintCategoryVisual category={category} modelConfig={modelConfig} />
              </Grid>

              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: { md: 380 },
                  pl: { md: 1 },
                }}
              >
                <Stack spacing={3} sx={{ maxWidth: 520 }}>
                  <Stack spacing={1.25}>
                    <Typography
                      variant="overline"
                      sx={{ color: colors.primary.main, fontWeight: 700, letterSpacing: '0.08em' }}
                    >
                      {category.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 700, lineHeight: 1.25 }}
                    >
                      {category.headline}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: colors.text.secondary, lineHeight: 1.65 }}
                    >
                      {category.description}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {category.specs.map((spec) => (
                      <Chip
                        key={spec.label}
                        label={`${spec.label}: ${spec.value}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontWeight: 500,
                          bgcolor: colors.background.paper,
                          pointerEvents: 'none',
                          cursor: 'default',
                          '&:hover': { bgcolor: colors.background.paper },
                        }}
                      />
                    ))}
                  </Box>

                  <Box>
                    <Button
                      component={Link}
                      href={printCategoryHref(category.id)}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        borderRadius: tokens.radiusPx.md,
                        px: 3,
                        py: 1.25,
                        fontWeight: 700,
                      }}
                    >
                      {category.ctaLabel}
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </Stack>
  );
}
