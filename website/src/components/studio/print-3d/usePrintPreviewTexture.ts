'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

type PreviewPalette = {
  stops: [string, string, string];
  accent: string;
};

const PREVIEW_PALETTES: Record<string, PreviewPalette> = {
  'coffee-mug': { stops: ['#f97316', '#fb923c', '#fef3c7'], accent: '#ffffff' },
  'travel-mug': { stops: ['#64748b', '#94a3b8', '#e2e8f0'], accent: '#f8fafc' },
  'picture-frame': { stops: ['#78716c', '#a8a29e', '#fafaf9'], accent: '#ffffff' },
  'canvas-print': { stops: ['#059669', '#34d399', '#ecfdf5'], accent: '#ffffff' },
  'poster-frame': { stops: ['#7c3aed', '#a78bfa', '#ede9fe'], accent: '#ffffff' },
  't-shirt-men': { stops: ['#2563eb', '#60a5fa', '#dbeafe'], accent: '#ffffff' },
  't-shirt-women': { stops: ['#db2777', '#f472b6', '#fce7f3'], accent: '#ffffff' },
};

const DEFAULT_PALETTE: PreviewPalette = {
  stops: ['#6366f1', '#818cf8', '#e0e7ff'],
  accent: '#ffffff',
};

function createWhiteCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 2;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 2, 2);
  }
  return canvas;
}

function createPreviewCanvas(productId: string): HTMLCanvasElement {
  if (productId === '__white__') {
    return createWhiteCanvas();
  }
  const palette = PREVIEW_PALETTES[productId] ?? DEFAULT_PALETTE;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, palette.stops[0]);
  gradient.addColorStop(0.55, palette.stops[1]);
  gradient.addColorStop(1, palette.stops[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(360, 140, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(120, 380, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(64, 64, canvas.width - 128, canvas.height - 128);

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = palette.accent;
  ctx.font = '600 28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Your design', canvas.width / 2, canvas.height / 2 + 10);

  return canvas;
}

/** Procedural preview texture — canvas only, zero network requests. */
export function usePrintPreviewTexture(productId: string): THREE.Texture {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') {
      const data = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
      data.colorSpace = THREE.SRGBColorSpace;
      data.needsUpdate = true;
      return data;
    }

    const canvas = createPreviewCanvas(productId);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    map.anisotropy = 8;
    map.needsUpdate = true;
    return map;
  }, [productId]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}
