'use client';

import Stack from '@mui/material/Stack';
import { StudioPrintExperience } from '@/components/studio/StudioPrintExperience';

/** Print studio landing — category rows with previews. */
export function StudioPrintSection() {
  return (
    <Stack spacing={5}>
      <StudioPrintExperience />
    </Stack>
  );
}
