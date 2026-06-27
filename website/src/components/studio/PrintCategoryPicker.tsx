import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductSizeLabel } from '@/components/studio/ProductSizeLabel';
import { getPrintCategory } from '@/config/print-categories';
import { formatStudioProductSize } from '@/config/studio-product-sizes';
import { listStudioPrintProducts, studioProductHref, type StudioPrintGroupId } from '@/config/studio-nav';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

type PrintCategoryPickerProps = {
  groupId: StudioPrintGroupId;
};

export function PrintCategoryPicker({ groupId }: PrintCategoryPickerProps) {
  const category = getPrintCategory(groupId);
  if (!category) return null;

  const products = listStudioPrintProducts().filter((product) => product.printGroupId === groupId);

  return (
    <>
      <PageHeader
        eyebrow="Print"
        title={category.headline}
        description={category.description}
        compact
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
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

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Choose a {category.title.toLowerCase()} style
      </Typography>

      <Grid container spacing={2.5}>
        {products.map((product) => {
          const Icon = product.icon;
          const size = formatStudioProductSize(product);
          return (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: colors.background.paper,
                  '&:hover': { borderColor: colors.primary.main },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={studioProductHref(product)}
                  sx={{
                    p: 2.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
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
                    <Icon sx={{ fontSize: 26 }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {product.label}
                  </Typography>
                  {product.description ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1.25, lineHeight: 1.55 }}
                    >
                      {product.description}
                    </Typography>
                  ) : null}
                  {size ? <ProductSizeLabel size={size} variant="inline" /> : null}
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
