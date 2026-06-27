'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { CreateProjectButton } from '@/components/client/CreateProjectButton';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  CrafingAuthError,
  crafingGraphql,
  workListThumbnail,
  type UserWorkListItem,
} from '@/lib/crafing-graphql';
import { openEditor } from '@/lib/editor-client';

export default function ProjectsPage() {
  const [designs, setDesigns] = useState<UserWorkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDesigns = useCallback(async () => {
    setLoading(true);
    setError('');
    setAuthError(false);
    try {
      const items = await crafingGraphql.fetchWorkList();
      setDesigns(items);
    } catch (err) {
      if (err instanceof CrafingAuthError) {
        setAuthError(true);
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Could not load saved designs');
      }
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDesigns();
  }, [loadDesigns]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await crafingGraphql.deleteWork(id);
      await loadDesigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete design');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Saved designs" compact />

      {authError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || 'Sign in required to view saved designs.'}{' '}
          <Link href="/login" style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </Alert>
      )}

      {!authError && error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => void loadDesigns()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <CreateProjectButton onCreated={loadDesigns} />
          </Grid>

          {!authError &&
            designs.length === 0 &&
            !error && (
              <Grid size={{ xs: 12 }}>
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No saved designs yet. Create your first design to get started.
                </Typography>
              </Grid>
            )}

          {designs.map((work) => (
            <Grid key={work.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': { transform: 'translateY(-4px)' },
                  '&:hover .design-thumb': { transform: 'scale(1.05)' },
                }}
              >
                <IconButton
                  size="small"
                  aria-label="Delete design"
                  disabled={deletingId === work.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleDelete(work.id);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    bgcolor: 'background.paper',
                    opacity: 0.9,
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>

                <CardActionArea
                  onClick={() => openEditor({ workId: work.id })}
                  sx={{ height: '100%' }}
                >
                  <CardMedia
                    className="design-thumb"
                    component="img"
                    image={workListThumbnail(work)}
                    alt={work.name}
                    sx={{ aspectRatio: 1, objectFit: 'cover', transition: 'transform 0.35s ease' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {work.name}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {work.pageCount} {work.pageCount === 1 ? 'page' : 'pages'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ·
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Updated {new Date(work.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
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
