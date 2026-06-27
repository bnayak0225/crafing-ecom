import type { PrintArea } from '@/components/studio/print-3d/mug-wrap/canvas-utils';
import { drawStars } from '@/components/studio/print-3d/mug-wrap/canvas-utils';

export function drawSpaceWrap(ctx: CanvasRenderingContext2D, area: PrintArea) {
  const { x, y, w, h, cx, cy } = area;

  const bg = ctx.createLinearGradient(x, 0, x + w, h);
  bg.addColorStop(0, '#050816');
  bg.addColorStop(0.4, '#1a1040');
  bg.addColorStop(0.7, '#0c1f4d');
  bg.addColorStop(1, '#020610');
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  const nebula = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.45);
  nebula.addColorStop(0, 'rgba(139, 92, 246, 0.45)');
  nebula.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
  nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebula;
  ctx.fillRect(x, y, w, h);

  drawStars(ctx, 120, w, h, 'rgba(255,255,255,0.85)');
  drawStars(ctx, 40, w, h, 'rgba(180,220,255,0.6)');

  // Planets
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(cx - 180, cy - 30, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,200,120,0.4)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(cx - 180, cy - 30, 58, 14, 0.4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(cx + 200, cy + 40, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('COSMIC DRIP', cx, cy + 8);

  ctx.fillStyle = 'rgba(226,232,240,0.7)';
  ctx.font = '500 14px system-ui, sans-serif';
  ctx.fillText('beyond the orbit', cx, cy + 34);
}
