import Box from '@mui/material/Box';
import { HorizontalScrollRow } from '@/components/layout/HorizontalScrollRow';
import { TemplateCard } from '@/components/TemplateCard';
import type { Template } from '@/types';

const TEMPLATE_CARD_WIDTH = 280;

interface TemplateGridProps {
  templates: Template[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  return (
    <HorizontalScrollRow gap={2.5}>
      {templates.map((template) => (
        <Box key={template.id} sx={{ width: TEMPLATE_CARD_WIDTH }}>
          <TemplateCard template={template} />
        </Box>
      ))}
    </HorizontalScrollRow>
  );
}
