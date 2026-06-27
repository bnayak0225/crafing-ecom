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
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ACCEPTED_IMAGE_TYPES,
  dataUrlToBlob,
  downloadBlob,
  MAX_UPLOAD_BYTES,
  readFileAsDataUrl,
} from '@/lib/image-tool-shared';
import {
  probeImageUpload,
  resizeImageCustom,
  type CropPosition,
  type CropUnit,
  type OutputFormat,
  type ResizeFit,
} from '@/lib/image-resizer-api';
import { colors } from '@/theme/colors';
import { tokens } from '@/theme/tokens';

const FIT_OPTIONS: { value: ResizeFit; label: string; hint: string }[] = [
  { value: 'inside', label: 'Fit inside', hint: 'Keep aspect ratio within the box' },
  { value: 'cover', label: 'Fill & crop', hint: 'Cover the box; use crop position' },
  { value: 'fill', label: 'Stretch', hint: 'Exact width × height' },
];

const POSITION_OPTIONS: { value: CropPosition; label: string }[] = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function extensionForFormat(format: OutputFormat) {
  if (format === 'png') return 'png';
  if (format === 'webp') return 'webp';
  return 'jpg';
}

export function ImageResizerTool() {
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState('image');
  const [sourceWidth, setSourceWidth] = useState<number | null>(null);
  const [sourceHeight, setSourceHeight] = useState<number | null>(null);
  const [sourceBytes, setSourceBytes] = useState<number | null>(null);

  const [outputWidth, setOutputWidth] = useState('');
  const [outputHeight, setOutputHeight] = useState('');
  const [fit, setFit] = useState<ResizeFit>('inside');
  const [position, setPosition] = useState<CropPosition>('center');
  const [cropEnabled, setCropEnabled] = useState(false);
  const [cropUnit, setCropUnit] = useState<CropUnit>('percent');
  const [cropX, setCropX] = useState('0');
  const [cropY, setCropY] = useState('0');
  const [cropW, setCropW] = useState('100');
  const [cropH, setCropH] = useState('100');
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [lockAspect, setLockAspect] = useState(true);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [resultWidth, setResultWidth] = useState<number | null>(null);
  const [resultHeight, setResultHeight] = useState<number | null>(null);
  const [resultBytes, setResultBytes] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRequestRef = useRef(0);

  const resetTool = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setError(null);
    setSourceDataUrl(null);
    setSourceName('image');
    setSourceWidth(null);
    setSourceHeight(null);
    setSourceBytes(null);
    setOutputWidth('');
    setOutputHeight('');
    setFit('inside');
    setPosition('center');
    setCropEnabled(false);
    setCropUnit('percent');
    setCropX('0');
    setCropY('0');
    setCropW('100');
    setCropH('100');
    setQuality(85);
    setFormat('jpeg');
    setPreviewUrl(null);
    setPreviewBlob(null);
    setResultWidth(null);
    setResultHeight(null);
    setResultBytes(null);
  }, [previewUrl]);

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

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const probe = await probeImageUpload(dataUrl);
      setSourceDataUrl(dataUrl);
      setSourceName(file.name.replace(/\.[^.]+$/, '') || 'image');
      setSourceWidth(probe.width);
      setSourceHeight(probe.height);
      setSourceBytes(probe.byteSize);
      setOutputWidth(String(probe.width));
      setOutputHeight(String(probe.height));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load image.');
    }
  }, []);

  const onPickFile = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  const onOutputWidthChange = useCallback(
    (value: string) => {
      setOutputWidth(value);
      if (!lockAspect || !sourceWidth || !sourceHeight) return;
      const w = Number(value);
      if (!Number.isFinite(w) || w <= 0) return;
      setOutputHeight(String(Math.round((w * sourceHeight) / sourceWidth)));
    },
    [lockAspect, sourceHeight, sourceWidth],
  );

  const onOutputHeightChange = useCallback(
    (value: string) => {
      setOutputHeight(value);
      if (!lockAspect || !sourceWidth || !sourceHeight) return;
      const h = Number(value);
      if (!Number.isFinite(h) || h <= 0) return;
      setOutputWidth(String(Math.round((h * sourceWidth) / sourceHeight)));
    },
    [lockAspect, sourceHeight, sourceWidth],
  );

  useEffect(() => {
    if (!sourceDataUrl) return;

    const requestId = ++previewRequestRef.current;
    const timer = window.setTimeout(async () => {
      setProcessing(true);
      setError(null);

      try {
        const w = Number(outputWidth);
        const h = Number(outputHeight);
        const result = await resizeImageCustom({
          imageDataUrl: sourceDataUrl,
          width: Number.isFinite(w) && w > 0 ? w : null,
          height: Number.isFinite(h) && h > 0 ? h : null,
          fit,
          position: fit === 'cover' ? position : undefined,
          crop: cropEnabled
            ? {
                unit: cropUnit,
                x: Number(cropX),
                y: Number(cropY),
                width: Number(cropW),
                height: Number(cropH),
              }
            : null,
          quality,
          format,
          allowEnlarge: false,
        });

        if (requestId !== previewRequestRef.current) return;

        const blob = dataUrlToBlob(result.imageDataUrl);
        const nextUrl = URL.createObjectURL(blob);
        setPreviewBlob(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return nextUrl;
        });
        setResultWidth(result.width);
        setResultHeight(result.height);
        setResultBytes(result.byteSize);
      } catch (err) {
        if (requestId === previewRequestRef.current) {
          setError(err instanceof Error ? err.message : 'Could not resize image.');
        }
      } finally {
        if (requestId === previewRequestRef.current) {
          setProcessing(false);
        }
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [
    sourceDataUrl,
    outputWidth,
    outputHeight,
    fit,
    position,
    cropEnabled,
    cropUnit,
    cropX,
    cropY,
    cropW,
    cropH,
    quality,
    format,
  ]);

  const onDownload = useCallback(() => {
    if (!previewBlob) return;
    downloadBlob(previewBlob, `${sourceName}-resized.${extensionForFormat(format)}`);
  }, [format, previewBlob, sourceName]);

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
            Free online image resizer
          </Typography>
          <Typography sx={{ color: colors.text.secondary, maxWidth: 720, fontSize: '1.05rem' }}>
            Resize, crop, and compress images in your browser session. Set output dimensions, crop
            by percentage or pixels, choose fill position, and control JPEG/WebP quality — nothing is
            saved to your account.
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
              minHeight: { md: 560 },
            }}
          >
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
                  minHeight: { xs: 280, md: 480 },
                  borderRadius: tokens.radiusPx.lg,
                  overflow: 'hidden',
                  border: 1,
                  borderColor: colors.border.subtle,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {previewUrl ? (
                  <>
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                    {processing ? (
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
                        <CircularProgress size={36} />
                      </Box>
                    ) : null}
                  </>
                ) : sourceDataUrl ? (
                  <Stack spacing={1} sx={{ alignItems: 'center' }}>
                    <CircularProgress size={40} />
                    <Typography color="text.secondary">Generating preview…</Typography>
                  </Stack>
                ) : (
                  <Stack spacing={1.5} sx={{ px: 3, textAlign: 'center', alignItems: 'center' }}>
                    <ImageOutlinedIcon sx={{ fontSize: 48, color: colors.text.disabled }} />
                    <Typography color="text.secondary">Your resized preview will appear here</Typography>
                  </Stack>
                )}
              </Box>
              {resultWidth && resultHeight ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                  Output: {resultWidth} × {resultHeight}px
                  {resultBytes != null ? ` · ${formatBytes(resultBytes)}` : ''}
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
              {!sourceDataUrl ? (
                <Stack spacing={3} sx={{ height: '100%', justifyContent: 'center' }}>
                  <Box
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      onPickFile(e.dataTransfer.files);
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
                    <CloudUploadOutlinedIcon sx={{ fontSize: 44, color: colors.primary.main, mb: 1 }} />
                    <Typography sx={{ mb: 0.5, fontWeight: 700 }}>
                      Drag and drop an image or browse to upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      JPEG, PNG, or WebP up to 40MB.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{ borderRadius: tokens.radiusPx.md, textTransform: 'none', fontWeight: 700 }}
                    >
                      Upload your photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={(e) => onPickFile(e.target.files)}
                    />
                  </Box>
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
                </Stack>
              ) : (
                <Stack spacing={2.5}>
                  {sourceWidth && sourceHeight ? (
                    <Typography variant="body2" color="text.secondary">
                      Original: {sourceWidth} × {sourceHeight}px
                      {sourceBytes != null ? ` · ${formatBytes(sourceBytes)}` : ''}
                    </Typography>
                  ) : null}

                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<DownloadOutlinedIcon />}
                      onClick={onDownload}
                      disabled={!previewBlob || processing}
                      sx={{ flex: 1, borderRadius: tokens.radiusPx.md, textTransform: 'none', fontWeight: 700 }}
                    >
                      Download
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

                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Output size (px)
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <TextField
                      label="Width"
                      type="number"
                      size="small"
                      value={outputWidth}
                      onChange={(e) => onOutputWidthChange(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Height"
                      type="number"
                      size="small"
                      value={outputHeight}
                      onChange={(e) => onOutputHeightChange(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Lock aspect ratio when editing width/height"
                  />

                  <FormControl size="small" fullWidth>
                    <InputLabel>Resize mode</InputLabel>
                    <Select
                      label="Resize mode"
                      value={fit}
                      onChange={(e) => setFit(e.target.value as ResizeFit)}
                    >
                      {FIT_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label} — {opt.hint}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" fullWidth>
                    <InputLabel>Crop position</InputLabel>
                    <Select
                      label="Crop position"
                      value={position}
                      disabled={fit !== 'cover'}
                      onChange={(e) => setPosition(e.target.value as CropPosition)}
                    >
                      {POSITION_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={cropEnabled}
                        onChange={(e) => setCropEnabled(e.target.checked)}
                      />
                    }
                    label="Crop region before resize"
                  />

                  {cropEnabled ? (
                    <Stack spacing={1.5}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Crop units</InputLabel>
                        <Select
                          label="Crop units"
                          value={cropUnit}
                          onChange={(e) => setCropUnit(e.target.value as CropUnit)}
                        >
                          <MenuItem value="percent">Percentage of image</MenuItem>
                          <MenuItem value="px">Pixels</MenuItem>
                        </Select>
                      </FormControl>
                      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                        <TextField
                          label={cropUnit === 'percent' ? 'X %' : 'X px'}
                          type="number"
                          size="small"
                          value={cropX}
                          onChange={(e) => setCropX(e.target.value)}
                          sx={{ flex: '1 1 45%' }}
                        />
                        <TextField
                          label={cropUnit === 'percent' ? 'Y %' : 'Y px'}
                          type="number"
                          size="small"
                          value={cropY}
                          onChange={(e) => setCropY(e.target.value)}
                          sx={{ flex: '1 1 45%' }}
                        />
                        <TextField
                          label={cropUnit === 'percent' ? 'Width %' : 'Width px'}
                          type="number"
                          size="small"
                          value={cropW}
                          onChange={(e) => setCropW(e.target.value)}
                          sx={{ flex: '1 1 45%' }}
                        />
                        <TextField
                          label={cropUnit === 'percent' ? 'Height %' : 'Height px'}
                          type="number"
                          size="small"
                          value={cropH}
                          onChange={(e) => setCropH(e.target.value)}
                          sx={{ flex: '1 1 45%' }}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Percent mode: 0–100 from top-left. Example: X=10, Y=10, W=80, H=80 crops the
                        center 80%.
                      </Typography>
                    </Stack>
                  ) : null}

                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Quality & format
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select
                      label="Format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    >
                      <MenuItem value="jpeg">JPEG</MenuItem>
                      <MenuItem value="webp">WebP</MenuItem>
                      <MenuItem value="png">PNG (lossless)</MenuItem>
                    </Select>
                  </FormControl>
                  {format !== 'png' ? (
                    <Box sx={{ px: 0.5 }}>
                      <Typography variant="body2" gutterBottom>
                        Quality: {quality}
                      </Typography>
                      <Slider
                        value={quality}
                        min={1}
                        max={100}
                        onChange={(_e, value) => setQuality(value as number)}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      PNG export is lossless — quality slider does not apply.
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2, textAlign: 'center' }}
        >
          Images are processed in memory on image-resize (port 4001) and are not stored on our
          servers.
        </Typography>
      </Container>
    </Box>
  );
}
