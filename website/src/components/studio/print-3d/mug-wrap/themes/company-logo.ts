import type { PrintArea } from '@/components/studio/print-3d/mug-wrap/canvas-utils';
import { roundRect } from '@/components/studio/print-3d/mug-wrap/canvas-utils';

export function drawCompanyLogoWrap(ctx: CanvasRenderingContext2D, area: PrintArea) {
  const { x, y, w, h, cx, cy } = area;

  const bg = ctx.createLinearGradient(x, 0, x + w, h);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(0.5, '#1e293b');
  bg.addColorStop(1, '#0f172a');
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  // Brand accent bands
  const accent = ctx.createLinearGradient(x, 0, x + w, 0);
  accent.addColorStop(0, '#f97316');
  accent.addColorStop(0.5, '#fb923c');
  accent.addColorStop(1, '#f97316');
  ctx.fillStyle = accent;
  ctx.fillRect(x, 0, w, 6);
  ctx.fillRect(x, h - 6, w, 6);

  // Logo mark
  ctx.save();
  ctx.translate(cx, cy);

  const markGrad = ctx.createLinearGradient(-60, -60, 60, 60);
  markGrad.addColorStop(0, '#f97316');
  markGrad.addColorStop(1, '#fdba74');
  ctx.fillStyle = markGrad;
  ctx.beginPath();
  ctx.arc(0, -20, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 44px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('C', 0, -18);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 36px system-ui, sans-serif';
  ctx.fillText('CRAFING', 0, 52);

  ctx.fillStyle = 'rgba(248,250,252,0.65)';
  ctx.font = '500 13px system-ui, sans-serif';
  ctx.letterSpacing = '0.28em';
  ctx.fillText('PRINT STUDIO', 0, 82);

  roundRect(ctx, -200, -115, 400, 230, 16);
  ctx.strokeStyle = 'rgba(249,115,22,0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}
