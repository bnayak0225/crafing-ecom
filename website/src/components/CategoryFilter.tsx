import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  searchQuery: string;
  hidden?: boolean;
}

export function CategoryFilter({
  categories,
  activeCategory,
  searchQuery,
  hidden = false,
}: CategoryFilterProps) {
  if (hidden) return null;

  const buildHref = (categoryId: string) => {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    if (searchQuery) params.set('q', searchQuery);
    const qs = params.toString();
    return qs ? `/studio?${qs}` : '/studio';
  };

  const linkSx = { textDecoration: 'none', color: 'inherit' } as const;

  return (
    <Stack spacing={1.5} sx={{ mb: 4 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
        Filter by category
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Link href={buildHref('')} style={linkSx}>
          <Chip
            label="All templates"
            clickable
            variant={!activeCategory ? 'filled' : 'outlined'}
            color={!activeCategory ? 'primary' : 'default'}
          />
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={buildHref(c.id)} style={linkSx}>
            <Chip
              label={c.name}
              clickable
              variant={activeCategory === c.id ? 'filled' : 'outlined'}
              color={activeCategory === c.id ? 'primary' : 'default'}
            />
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}
