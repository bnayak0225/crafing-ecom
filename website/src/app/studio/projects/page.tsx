'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { CreateProjectButton } from '@/components/client/CreateProjectButton';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiClient } from '@/lib/api-client';
import { openEditor } from '@/lib/editor-client';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .getProjects()
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <PageHeader title="My work" compact />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <CreateProjectButton />
          </Grid>
          {projects.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  '&:hover': { transform: 'translateY(-4px)' },
                  '&:hover .project-thumb': { transform: 'scale(1.05)' },
                }}
              >
                <CardActionArea
                  onClick={() =>
                    openEditor({
                      projectId: p.id,
                      width: p.width,
                      height: p.height,
                      title: p.title,
                    })
                  }
                  sx={{ height: '100%' }}
                >
                  <CardMedia
                    className="project-thumb"
                    component="img"
                    image={p.thumbnail}
                    alt={p.title}
                    sx={{ aspectRatio: 1, objectFit: 'cover', transition: 'transform 0.35s ease' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {p.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Edited {new Date(p.updatedAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}
