import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { getEditorUrl } from '@/lib/editor';
import { TemplateSizeBadge } from '@/components/studio/TemplateSizeBadge';
import { colors } from '@/theme/colors';
import type { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const href = getEditorUrl({
    templateId: template.id,
    width: template.width,
    height: template.height,
    title: template.title,
  });

  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        bgcolor: colors.background.paper,
        '&:hover .template-open-icon': { opacity: 1 },
      }}
    >
      <CardActionArea
        href={href}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={template.thumbnail}
            alt={template.title}
            sx={{
              aspectRatio: '4/3',
              objectFit: 'cover',
            }}
          />
          <Box
            className="template-open-icon"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: colors.overlay.scrim,
              opacity: 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <OpenInNewOutlinedIcon
              sx={{ fontSize: 32, color: colors.common.onDark }}
            />
          </Box>
          {template.premium && (
            <Chip
              label="Pro"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                height: 24,
                fontWeight: 700,
                fontSize: '0.6875rem',
                bgcolor: colors.secondary.main,
                color: colors.secondary.contrast,
              }}
            />
          )}
          <TemplateSizeBadge width={template.width} height={template.height} />
        </Box>
        <CardContent sx={{ flexGrow: 1, py: 2, px: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.75 }}>
            {template.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
            <TemplateSizeBadge
              width={template.width}
              height={template.height}
              position="inline"
            />
            <Typography variant="caption" color="text.disabled">
              ·
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {template.uses.toLocaleString()} uses
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
