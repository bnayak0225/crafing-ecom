'use client';

import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ACCEPTED_IMAGE_TYPES,
  blobToDataUrl,
  compositeBackgroundFill,
  downloadBlob,
  GRADIENT_PRESETS,
  MAX_UPLOAD_BYTES,
  readFileAsDataUrl,
  removeBackgroundFromUpload,
  SOLID_PRESETS,
  STOCK_BACKGROUNDS,
  urlToDataUrl,
  type BackgroundGradient,
  type FillType,
} from '@/lib/background-remover-api';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

type Phase = 'upload' | 'removing' | 'editing';

const checkerboard = `
  linear-gradient(45deg, #e2e5ea 25%, transparent 25%),
  linear-gradient(-45deg, #e2e5ea 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #e2e5ea 75%),
  linear-gradient(-45deg, transparent 75%, #e2e5ea 75%)
`;

function gradientCss(gradient: BackgroundGradient) {
  const stops = [...gradient.stops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');
  if (gradient.type === 'radial') {
    return `radial-gradient(circle at center, ${stops})`;
  }
  return `linear-gradient(${gradient.angle}deg, ${stops})`;
}

function TrustBadges() {
  return (
    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
      {['Free to use', 'No sign-in required'].map((label) => (
        <Stack key={label} direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: colors.primary.main }} />
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export function BackgroundRemoverTool() {
  const [phase, setPhase] = useState<Phase>('upload');
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | null>(null);
  const [transparentBlobUrl, setTransparentBlobUrl] = useState<string | null>(null);
  const [transparentDataUrl, setTransparentDataUrl] = useState<string | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [fillType, setFillType] = useState<FillType>('transparent');
  const [solidColor, setSolidColor] = useState('#FFFFFF');
  const [gradient, setGradient] = useState<BackgroundGradient>(GRADIENT_PRESETS[0].gradient);
  const [underlayDataUrl, setUnderlayDataUrl] = useState<string | null>(null);
  const [underlayPreview, setUnderlayPreview] = useState<string | null>(null);
  const [applyingFill, setApplyingFill] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const previewRequestRef = useRef(0);

  const displayImageUrl = useMemo(() => {
    if (fillType === 'transparent') return transparentBlobUrl;
    return previewBlobUrl || transparentBlobUrl;
  }, [fillType, previewBlobUrl, transparentBlobUrl]);

  const resetTool = useCallback(() => {
    if (transparentBlobUrl) URL.revokeObjectURL(transparentBlobUrl);
    if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    setPhase('upload');
    setError(null);
    setProgressMessage(null);
    setWsStatus(null);
    setTransparentBlobUrl(null);
    setTransparentDataUrl(null);
    setPreviewBlobUrl(null);
    setPreviewBlob(null);
    setFillType('transparent');
    setSolidColor('#FFFFFF');
    setGradient(GRADIENT_PRESETS[0].gradient);
    setUnderlayDataUrl(null);
    setUnderlayPreview(null);
    setApplyingFill(false);
  }, [previewBlobUrl, transparentBlobUrl]);

  const processFile = useCallback(async (file: File) => {
    setError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('File must be JPEG, PNG, or WebP.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('File must be 40MB or smaller.');
      return;
    }

    setPhase('removing');
    setProgressMessage(null);
    setWsStatus(null);

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      const blob = await removeBackgroundFromUpload(imageDataUrl, {
        onWsStatus: setWsStatus,
        onProgress: (update) => {
          if (update.message) setProgressMessage(update.message);
        },
      });
      const blobUrl = URL.createObjectURL(blob);
      const dataUrl = await blobToDataUrl(blob);

      setTransparentBlobUrl(blobUrl);
      setTransparentDataUrl(dataUrl);
      setPreviewBlob(blob);
      setPreviewBlobUrl(null);
      setFillType('transparent');
      setPhase('editing');
    } catch (err) {
      setPhase('upload');
      setProgressMessage(null);
      setWsStatus(null);
      setError(err instanceof Error ? err.message : 'Background removal failed');
    }
  }, []);

  const onPickFile = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  useEffect(() => {
    if (phase !== 'editing' || !transparentDataUrl) return;

    if (fillType === 'transparent') {
      setPreviewBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      if (transparentBlobUrl) {
        fetch(transparentBlobUrl)
          .then((res) => res.blob())
          .then(setPreviewBlob)
          .catch(() => {});
      }
      return;
    }

    if (fillType === 'image' && !underlayDataUrl) return;

    const requestId = ++previewRequestRef.current;
    const timer = window.setTimeout(async () => {
      setApplyingFill(true);
      setError(null);

      try {
        const blob = await compositeBackgroundFill({
          foregroundDataUrl: transparentDataUrl,
          fillType,
          backgroundColor: fillType === 'solid' ? solidColor : null,
          backgroundGradient: fillType === 'gradient' ? gradient : null,
          underlayDataUrl: fillType === 'image' ? underlayDataUrl : null,
        });

        if (requestId !== previewRequestRef.current) return;

        const nextUrl = URL.createObjectURL(blob);
        setPreviewBlob(blob);
        setPreviewBlobUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return nextUrl;
        });
      } catch (err) {
        if (requestId === previewRequestRef.current) {
          setError(err instanceof Error ? err.message : 'Could not apply background');
        }
      } finally {
        if (requestId === previewRequestRef.current) {
          setApplyingFill(false);
        }
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [fillType, gradient, phase, solidColor, transparentBlobUrl, transparentDataUrl, underlayDataUrl]);

  const onDownload = useCallback(() => {
    if (!previewBlob) return;
    const name =
      fillType === 'transparent' ? 'removed-background.png' : 'image-with-background.png';
    downloadBlob(previewBlob, name);
  }, [fillType, previewBlob]);

  const onCustomBackground = useCallback(async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Background must be JPEG, PNG, or WebP.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUnderlayDataUrl(dataUrl);
      setUnderlayPreview(dataUrl);
      setFillType('image');
    } catch {
      setError('Could not read background image.');
    }
  }, []);

  const onStockBackground = useCallback(async (url: string) => {
    setError(null);
    try {
      const dataUrl = await urlToDataUrl(url);
      setUnderlayDataUrl(dataUrl);
      setUnderlayPreview(url);
      setFillType('image');
    } catch {
      setError('Could not load stock background.');
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={1.5} sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="overline" sx={{ color: colors.primary.main, fontWeight: 700 }}>
            Free tool
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              lineHeight: 1.15,
              color: colors.text.primary,
            }}
          >
            Free online background remover
          </Typography>
          <Typography sx={{ color: colors.text.secondary, maxWidth: 720, fontSize: '1.05rem' }}>
            Remove any background from photos and product images in seconds. Upload a JPEG, PNG,
            or WebP, customize the background, and download instantly — nothing is saved to your
            account.
          </Typography>
        </Stack>

        {error ? (
          <Box
            sx={{
              mb: 3,
              px: 2,
              py: 1.5,
              borderRadius: tokens.radiusPx.md,
              bgcolor: colors.accent.warm,
              color: colors.state.error.main,
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        ) : null}

        <Box
          sx={{
            borderRadius: tokens.radiusPx.xl,
            bgcolor: colors.background.paper,
            boxShadow: colors.shadow.heroPanel,
            overflow: 'hidden',
          }}
        >
          {phase === 'removing' ? (
            <Stack
              sx={{ minHeight: 420, px: 3, py: 8, alignItems: 'center', justifyContent: 'center' }}
              spacing={2}
            >
              <CircularProgress size={52} sx={{ color: colors.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Removing background…
              </Typography>
              <Typography color="text.secondary" sx={{ textAlign: 'center', maxWidth: 420 }}>
                {progressMessage ||
                  (wsStatus === 'connecting'
                    ? 'Connecting to image processor…'
                    : 'This can take up to a minute on the first run. Your image stays on this page only.')}
              </Typography>
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
                minHeight: { md: 520 },
              }}
            >
              {/* Preview */}
              <Box
                sx={{
                  p: { xs: 2, md: 3 },
                  bgcolor: colors.background.muted,
                  borderRight: { md: 1 },
                  borderColor: colors.border.subtle,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    minHeight: { xs: 280, md: 460 },
                    borderRadius: tokens.radiusPx.lg,
                    overflow: 'hidden',
                    border: 1,
                    borderColor: colors.border.subtle,
                    backgroundColor: '#fff',
                    backgroundImage: checkerboard,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {displayImageUrl ? (
                    <>
                      <Box
                        component="img"
                        src={displayImageUrl}
                        alt="Preview"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                      {applyingFill ? (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(255,255,255,0.55)',
                          }}
                        >
                          <Stack sx={{ alignItems: 'center' }} spacing={1}>
                            <CircularProgress size={36} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Updating preview…
                            </Typography>
                          </Stack>
                        </Box>
                      ) : null}
                    </>
                  ) : (
                    <Stack spacing={1.5} sx={{ px: 3, textAlign: 'center', alignItems: 'center' }}>
                      <ImageOutlinedIcon sx={{ fontSize: 48, color: colors.text.disabled }} />
                      <Typography color="text.secondary">
                        Your cutout preview will appear here
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>

              {/* Controls */}
              <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                {phase === 'upload' ? (
                  <Stack spacing={3} sx={{ height: '100%', justifyContent: 'center' }}>
                    <Box
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setDragOver(false);
                        onPickFile(event.dataTransfer.files);
                      }}
                      sx={{
                        border: '2px dashed',
                        borderColor: dragOver ? colors.primary.main : colors.border.strong,
                        borderRadius: tokens.radiusPx.lg,
                        bgcolor: dragOver ? colors.alpha.brand6 : colors.background.subtle,
                        px: 3,
                        py: 5,
                        textAlign: 'center',
                      }}
                    >
                      <CloudUploadOutlinedIcon
                        sx={{ fontSize: 44, color: colors.primary.main, mb: 1 }}
                      />
                      <Typography sx={{ mb: 0.5, fontWeight: 700 }}>
                        Drag and drop an image or browse to upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                        File must be JPEG, PNG, or WebP and up to 40MB.
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          px: 3,
                          borderRadius: tokens.radiusPx.md,
                          textTransform: 'none',
                          fontWeight: 700,
                        }}
                      >
                        Upload your photo
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={(event) => onPickFile(event.target.files)}
                      />
                    </Box>
                    <TrustBadges />
                  </Stack>
                ) : (
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<DownloadOutlinedIcon />}
                        onClick={onDownload}
                        disabled={!previewBlob || applyingFill}
                        sx={{
                          flex: 1,
                          borderRadius: tokens.radiusPx.md,
                          textTransform: 'none',
                          fontWeight: 700,
                        }}
                      >
                        Download image
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<RefreshOutlinedIcon />}
                        onClick={resetTool}
                        sx={{ borderRadius: tokens.radiusPx.md, textTransform: 'none' }}
                      >
                        New image
                      </Button>
                    </Stack>

                    <TrustBadges />

                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
                        What&apos;s next for this image?
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Transparent
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <BackgroundTile
                          active={fillType === 'transparent'}
                          label="No background"
                          onClick={() => setFillType('transparent')}
                          checker
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Solid color
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {SOLID_PRESETS.map((preset) => (
                          <BackgroundTile
                            key={preset.id}
                            active={fillType === 'solid' && solidColor === preset.color}
                            label={preset.label}
                            onClick={() => {
                              setSolidColor(preset.color);
                              setFillType('solid');
                            }}
                            swatch={preset.color}
                          />
                        ))}
                        <BackgroundTile
                          active={fillType === 'solid'}
                          label="Custom"
                          onClick={() => setFillType('solid')}
                          swatch={solidColor}
                        />
                      </Box>
                      {fillType === 'solid' ? (
                        <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
                          <Box
                            component="input"
                            type="color"
                            value={solidColor}
                            onChange={(event) => setSolidColor(event.target.value)}
                            sx={{
                              width: 44,
                              height: 44,
                              border: 'none',
                              bgcolor: 'transparent',
                              cursor: 'pointer',
                            }}
                          />
                          <TextField
                            size="small"
                            value={solidColor}
                            onChange={(event) => setSolidColor(event.target.value)}
                            sx={{ width: 120 }}
                          />
                        </Stack>
                      ) : null}

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Gradient
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {GRADIENT_PRESETS.map((preset) => (
                          <BackgroundTile
                            key={preset.id}
                            active={
                              fillType === 'gradient' &&
                              JSON.stringify(preset.gradient) === JSON.stringify(gradient)
                            }
                            label={preset.label}
                            onClick={() => {
                              setGradient(preset.gradient);
                              setFillType('gradient');
                            }}
                            swatchCss={gradientCss(preset.gradient)}
                          />
                        ))}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Background image
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                        <BackgroundTile
                          active={false}
                          label="Upload"
                          onClick={() => bgInputRef.current?.click()}
                          upload
                        />
                        {STOCK_BACKGROUNDS.map((item) => (
                          <BackgroundTile
                            key={item.id}
                            active={fillType === 'image' && underlayPreview === item.url}
                            label={item.label}
                            onClick={() => void onStockBackground(item.url)}
                            imageUrl={item.url}
                          />
                        ))}
                      </Box>
                      <input
                        ref={bgInputRef}
                        type="file"
                        hidden
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={(event) => void onCustomBackground(event.target.files)}
                      />
                      {fillType === 'image' && underlayPreview ? (
                        <Typography variant="caption" color="text.secondary">
                          Custom or stock background selected
                        </Typography>
                      ) : null}
                    </Box>
                  </Stack>
                )}
              </Box>
            </Box>
          )}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2, textAlign: 'center' }}
        >
          Images are processed for this session only and are not stored on our servers.
        </Typography>
      </Container>
    </Box>
  );
}

function BackgroundTile({
  active,
  label,
  onClick,
  checker,
  swatch,
  swatchCss,
  imageUrl,
  upload,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  checker?: boolean;
  swatch?: string;
  swatchCss?: string;
  imageUrl?: string;
  upload?: boolean;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: 88,
        border: 2,
        borderColor: active ? colors.primary.main : colors.border.subtle,
        borderRadius: tokens.radiusPx.md,
        bgcolor: colors.background.paper,
        p: 0.75,
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: active ? `0 0 0 2px ${colors.alpha.brand16}` : 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: tokens.radiusPx.sm,
          overflow: 'hidden',
          mb: 0.75,
          border: 1,
          borderColor: colors.border.subtle,
          backgroundColor: swatch || '#fff',
          backgroundImage: checker
            ? checkerboard
            : swatchCss || (imageUrl ? `url(${imageUrl})` : undefined),
          backgroundSize: checker ? '12px 12px' : 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {upload ? (
          <CloudUploadOutlinedIcon sx={{ color: colors.text.secondary, fontSize: 22 }} />
        ) : null}
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 600 }} color="text.primary">
        {label}
      </Typography>
    </Box>
  );
}
