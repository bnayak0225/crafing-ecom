'use client';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { openEditor } from '@/lib/editor-client';
import { colors } from '@/theme/colors';

export function CreateProjectButton() {
  const [loading, setLoading] = useState(false);

  const handleNew = async () => {
    setLoading(true);
    try {
      const project = await apiClient.createProject({ title: 'Untitled Design' });
      openEditor({
        projectId: project.id,
        width: project.width,
        height: project.height,
        title: project.title,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleNew}
      disabled={loading}
      sx={{
        aspectRatio: 1,
        minHeight: 220,
        width: '100%',
        flexDirection: 'column',
        gap: 1,
        border: 1,
        borderStyle: 'dashed',
        borderColor: colors.border.strong,
        borderRadius: 2,
        color: colors.text.secondary,
        bgcolor: colors.background.paper,
        '&:hover': {
          borderColor: colors.primary.main,
          color: colors.primary.main,
          bgcolor: colors.alpha.brand6,
        },
      }}
    >
      <AddIcon sx={{ fontSize: 36, opacity: 0.8 }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {loading ? 'Creating…' : 'New design'}
      </Typography>
    </Button>
  );
}
