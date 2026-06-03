import Grid from '@mui/material/Grid';
import { TemplateCard } from '@/components/TemplateCard';
import type { Template } from '@/types';

interface TemplateGridProps {
  templates: Template[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  return (
    <Grid container spacing={2.5}>
      {templates.map((t) => (
        <Grid key={t.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
          <TemplateCard template={t} />
        </Grid>
      ))}
    </Grid>
  );
}
