'use client';

import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import type { SvgIconComponent } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { TemplateGrid } from '@/components/TemplateGrid';
import { getEditorUrl } from '@/lib/editor';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';
import type { Template } from '@/types';

interface LandingPageProps {
  templates: Template[];
}

const features = [
  {
    icon: AutoAwesomeOutlinedIcon,
    title: 'Curated templates',
    text: 'Hand-picked layouts for ads, social, print, and product pages.',
  },
  {
    icon: BrushOutlinedIcon,
    title: 'Light editor workflow',
    text: 'Opens your image-editor instantly — same bright workspace you already use.',
  },
  {
    icon: FolderSpecialOutlinedIcon,
    title: 'Projects & plans',
    text: 'Save work, upgrade when you need more exports and brand tools.',
  },
];

const steps = [
  { step: '01', title: 'Browse', text: 'Filter templates by category or search.' },
  { step: '02', title: 'Select', text: 'Pick a layout that matches your canvas size.' },
  { step: '03', title: 'Edit', text: 'Continue in your editor with one click.' },
];

const heroStats: { value: string; label: string; icon: SvgIconComponent }[] = [
  { value: '500+', label: 'Templates', icon: GridViewOutlinedIcon },
  { value: '7', label: 'Categories', icon: CategoryOutlinedIcon },
  { value: '1-click', label: 'To editor', icon: AdsClickOutlinedIcon },
];

export function LandingPage({ templates }: LandingPageProps) {
  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 5, md: 8 },
          pb: { xs: 8, md: 14 },
          background: colors.gradient.heroBase,
          borderBottom: 1,
          borderColor: colors.border.subtle,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `linear-gradient(${colors.alpha.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${colors.alpha.gridLine} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 20%, transparent 75%)',
          }}
        />
        <Box
          className="landing-orb"
          sx={{
            position: 'absolute',
            top: { xs: -80, md: -40 },
            left: { xs: -120, md: -60 },
            width: { xs: 280, md: 420 },
            height: { xs: 280, md: 420 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.alpha.brand20} 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }}
        />
        <Box
          className="landing-orb--delayed"
          sx={{
            position: 'absolute',
            top: { xs: 40, md: 80 },
            right: { xs: -100, md: -40 },
            width: { xs: 320, md: 520 },
            height: { xs: 320, md: 520 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.alpha.cyan20} 0%, ${colors.alpha.magenta20} 45%, transparent 72%)`,
            filter: 'blur(8px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={{ xs: 5, md: 6 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                variant="outlined"
                icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />}
                label="Templates · Editor · One flow"
                size="small"
                sx={{
                  mb: 2.5,
                  fontWeight: 600,
                  bgcolor: colors.background.paper,
                  color: colors.text.primary,
                  border: `1px solid ${colors.border.subtle}`,
                  boxShadow: colors.shadow.card,
                  '& .MuiChip-label': { color: colors.text.primary },
                  '& .MuiChip-icon': { color: colors.primary.main },
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.1rem', md: '3.5rem' },
                  mb: 2.5,
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                }}
              >
                Design faster with{' '}
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    backgroundImage: colors.gradient.brand,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  pro templates
                </Box>
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: colors.text.secondary, mb: 4, maxWidth: 500, lineHeight: 1.75, fontSize: '1.0625rem' }}
              >
                Pick a layout, land in your light image-editor instantly — curated sizes for
                social, ads, and print without a cluttered studio UI.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  href="/studio"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 3,
                    background: colors.gradient.heroAccent,
                    '&:hover': {
                      boxShadow: colors.shadow.cardHover,
                      background: colors.gradient.heroAccent,
                    },
                  }}
                >
                  Browse templates
                </Button>
                <Button
                  component="a"
                  href={getEditorUrl()}
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleOutlinedIcon />}
                  sx={{
                    bgcolor: colors.background.paper,
                    borderColor: colors.border.subtle,
                    '&:hover': {
                      bgcolor: colors.background.paper,
                      borderColor: colors.primary.main,
                    },
                  }}
                >
                  Start blank
                </Button>
              </Stack>
              <Stack
                direction="row"
                spacing={{ xs: 3, sm: 4, md: 5 }}
                sx={{ mt: 5, flexWrap: 'wrap', rowGap: 2.5 }}
              >
                {heroStats.map(({ value, label, icon: Icon }) => (
                  <Stack key={label} direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: tokens.radiusPx.sm,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: colors.alpha.brand8,
                        color: colors.primary.main,
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: colors.text.primary, lineHeight: 1.25 }}
                      >
                        {value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                        {label}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: tokens.radiusPx.md,
                  overflow: 'hidden',
                  bgcolor: colors.background.paper,
                  boxShadow: colors.shadow.elevated,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    px: 2,
                    py: 1.25,
                    alignItems: 'center',
                    bgcolor: colors.chrome.bar,
                    borderBottom: 1,
                    borderColor: colors.border.subtle,
                  }}
                >
                  <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
                    {[
                      colors.chrome.close,
                      colors.chrome.minimize,
                      colors.chrome.maximize,
                    ].map((dot) => (
                      <Box
                        key={dot}
                        sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: dot }}
                      />
                    ))}
                  </Stack>
                  <Box
                    sx={{
                      flex: 1,
                      mx: { xs: 1, sm: 2 },
                      py: 0.75,
                      px: 2,
                      borderRadius: tokens.radiusPx.sm,
                      bgcolor: colors.background.paper,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 500 }}>
                      cafing.studio — templates
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      flexShrink: 0,
                      color: colors.text.secondary,
                      fontWeight: 600,
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    Preview
                  </Typography>
                </Stack>
                <Box sx={{ p: 2, bgcolor: colors.background.subtle }}>
                  <Grid container spacing={1.5}>
                    {templates.slice(0, 4).map((t, i) => (
                      <Grid key={t.id} size={{ xs: 6 }}>
                        <Card
                          sx={{
                            overflow: 'hidden',
                            borderRadius: tokens.radiusPx.sm,
                            bgcolor: colors.background.paper,
                            transform: i % 2 === 1 ? 'translateY(10px)' : 'none',
                          }}
                        >
                          <CardActionArea
                            href={getEditorUrl({
                              templateId: t.id,
                              width: t.width,
                              height: t.height,
                              title: t.title,
                            })}
                          >
                            <CardMedia
                              component="img"
                              image={t.thumbnail}
                              alt={t.title}
                              sx={{ aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                            />
                            <Box sx={{ px: 1.25, py: 1, bgcolor: colors.background.paper }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }} noWrap>
                                {t.title}
                              </Typography>
                            </Box>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Template strip */}
      <Box
        id="templates"
        sx={{
          py: { xs: 6, md: 8 },
          background: colors.gradient.sectionBand,
          borderTop: 1,
          borderBottom: 1,
          borderColor: colors.border.subtle,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              mb: 4,
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Popular templates
              </Typography>
              <Typography variant="body1" sx={{ color: colors.text.secondary }}>
                Click any preview to open it in your editor.
              </Typography>
            </Box>
            <Button component={Link} href="/studio" endIcon={<ArrowForwardIcon />}>
              View all
            </Button>
          </Stack>
          <TemplateGrid templates={templates} />
        </Container>
      </Box>

      {/* How it works */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 5 }}>
          How it works
        </Typography>
        <Grid container spacing={3}>
          {steps.map(({ step, title, text }) => (
            <Grid key={step} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: colors.background.paper,
                  '&:hover': {
                    background: colors.gradient.surfaceGlow,
                  },
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: colors.primary.main, display: 'block', mb: 1 }}
                  >
                    Step {step}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.65 }}>
                    {text}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}
      <Box
        id="features"
        sx={{
          py: { xs: 6, md: 10 },
          background: colors.gradient.surfaceGlow,
          borderTop: 1,
          borderColor: colors.border.subtle,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 1 }}>
            Built for modern creators
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: colors.text.secondary,
              mb: 5,
              maxWidth: 520,
              mx: 'auto',
            }}
          >
            A clean studio that hands off to your editor — fast, light, and focused.
          </Typography>
          <Grid container spacing={3}>
            {features.map(({ icon: Icon, title, text }) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'default',
                    bgcolor: colors.background.paper,
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: tokens.radiusPx.md,
                        display: 'grid',
                        placeItems: 'center',
                        mb: 2,
                        bgcolor: colors.background.subtle,
                        color: colors.primary.main,
                        transition: 'background-color 0.2s',
                        '.MuiCard-root:hover &': {
                          bgcolor: colors.alpha.brand8,
                        },
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, lineHeight: 1.65 }}>
                      {text}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 10 }, textAlign: 'center' }}>
        <Card
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: { xs: 4, md: 6 },
            background: colors.gradient.heroAccent,
            border: 'none',
            boxShadow: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: colors.gradient.ctaShine,
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary.contrast, mb: 2 }}>
              Ready to create?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: colors.primary.contrast, opacity: 0.9, mb: 3, maxWidth: 400, mx: 'auto' }}
            >
              Jump into the studio and pick your first template in seconds.
            </Typography>
            <Button
              component={Link}
              href="/studio"
              size="large"
              sx={{
                bgcolor: colors.background.paper,
                color: colors.primary.main,
                fontWeight: 700,
                '&:hover': { bgcolor: colors.background.subtle },
              }}
            >
              Go to studio
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
