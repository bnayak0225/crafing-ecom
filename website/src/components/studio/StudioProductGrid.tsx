'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Link from 'next/link';
import { HorizontalScrollRow } from '@/components/layout/HorizontalScrollRow';
import { ProductSizeLabel } from '@/components/studio/ProductSizeLabel';
import {
  STUDIO_DESIGN_FILTER_TAGS,
  STUDIO_DESIGN_PRODUCTS,
  STUDIO_PRINT_FILTER_TAGS,
  STUDIO_PRINT_PRODUCTS,
  filterStudioProducts,
  studioProductHref,
  type StudioFilterTag,
  type StudioFilterTagId,
  type StudioProduct,
} from '@/config/studio-nav';
import { formatStudioProductSize } from '@/config/studio-product-sizes';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

const PRODUCT_CARD_WIDTH = 200;

function StudioProductCard({ product }: { product: StudioProduct }) {
  const Icon = product.icon;
  const size = formatStudioProductSize(product);

  return (
    <Card
      sx={{
        width: PRODUCT_CARD_WIDTH,
        minHeight: 196,
        bgcolor: colors.background.paper,
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      <Link
        href={studioProductHref(product)}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CardActionArea
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 2.5,
            height: '100%',
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {product.label}
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
            {product.description ?? `Create ${product.label.toLowerCase()}.`}
          </Typography>
        </CardActionArea>
      </Link>
    </Card>
  );
}

function ProductScrollRow({ products }: { products: StudioProduct[] }) {
  if (products.length === 0) {
    return (
      <Box
        sx={{
          py: 6,
          textAlign: 'center',
          borderRadius: tokens.radiusPx.md,
          bgcolor: colors.background.paper,
          border: `1px dashed ${colors.border.subtle}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No formats match your search. Try another tag or keyword.
        </Typography>
      </Box>
    );
  }

  return (
    <HorizontalScrollRow gap={2}>
      {products.map((product) => (
        <StudioProductCard key={product.id} product={product} />
      ))}
    </HorizontalScrollRow>
  );
}

type FilterableProductPickerProps = {
  products: StudioProduct[];
  tags: StudioFilterTag[];
  groupField: 'groupId' | 'printGroupId';
  searchPlaceholder: string;
};

function FilterableProductPicker({
  products,
  tags,
  groupField,
  searchPlaceholder,
}: FilterableProductPickerProps) {
  const [activeTag, setActiveTag] = useState<StudioFilterTagId>('all');
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(
    () => filterStudioProducts(products, { tagId: activeTag, query, groupField }),
    [products, activeTag, query, groupField],
  );

  return (
    <Stack spacing={2.5}>
      <TextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        size="small"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ maxWidth: 420 }}
      />

      <HorizontalScrollRow gap={1} snap={false}>
        {tags.map((tag) => {
          const selected = activeTag === tag.id;
          return (
            <Chip
              key={tag.id}
              label={tag.label}
              clickable
              onClick={() => setActiveTag(tag.id)}
              color={selected ? 'primary' : 'default'}
              variant={selected ? 'filled' : 'outlined'}
              sx={{ fontWeight: selected ? 700 : 500 }}
            />
          );
        })}
      </HorizontalScrollRow>

      <ProductScrollRow products={filteredProducts} />
    </Stack>
  );
}

export function StudioDesignPicker() {
  return (
    <FilterableProductPicker
      products={STUDIO_DESIGN_PRODUCTS}
      tags={STUDIO_DESIGN_FILTER_TAGS}
      groupField="groupId"
      searchPlaceholder="Search design formats…"
    />
  );
}

export function StudioPrintPicker() {
  return (
    <FilterableProductPicker
      products={STUDIO_PRINT_PRODUCTS}
      tags={STUDIO_PRINT_FILTER_TAGS}
      groupField="printGroupId"
      searchPlaceholder="Search print products…"
    />
  );
}

/** Back-compat alias */
export function StudioProductGrid() {
  return <StudioPrintPicker />;
}
