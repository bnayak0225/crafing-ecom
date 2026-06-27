import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ProductSizeLabel } from '@/components/studio/ProductSizeLabel';
import { formatTemplateSize } from '@/components/studio/TemplateSizeBadge';
import type { FeaturedTheme } from '@/config/featured-themes';
import { getEditorUrl } from '@/lib/editor';
import { colors } from '@/theme/colors';

interface FeaturedThemeCardProps {
  theme: FeaturedTheme;
}

export function FeaturedThemeCard({ theme }: FeaturedThemeCardProps) {
  const pageSize = formatTemplateSize(theme.width, theme.height);
  const href = getEditorUrl({
    templateId: theme.templateId,
    width: theme.width,
    height: theme.height,
    title: theme.themeName,
  });

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: colors.background.paper,
      }}
    >
      <CardActionArea
        href={href}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          textAlign: 'left',
        }}
      >
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          <CardMedia
            component="img"
            image={theme.thumbnail}
            alt={theme.themeName}
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 160,
              aspectRatio: '4/3',
              objectFit: 'cover',
            }}
          />
          {theme.premium ? (
            <Chip
              label="Pro"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                height: 22,
                fontWeight: 700,
                fontSize: '0.625rem',
                bgcolor: colors.secondary.main,
                color: colors.secondary.contrast,
              }}
            />
          ) : null}
        </Box>

        <Stack spacing={0.35} sx={{ px: 2, py: 1.75, flexShrink: 0 }}>
          <Typography variant="subtitle2" component="p" sx={{ fontWeight: 700, lineHeight: 1.3, m: 0 }}>
            {theme.themeName}
          </Typography>
          <Typography variant="body2" component="p" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.35, m: 0 }}>
            {theme.templateName}
          </Typography>
          <ProductSizeLabel size={pageSize} variant="inline" />
        </Stack>
      </CardActionArea>
    </Card>
  );
}
