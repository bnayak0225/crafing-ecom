import type { PrintArea } from '@/components/studio/print-3d/mug-wrap/canvas-utils';

export function drawNatureWrap(ctx: CanvasRenderingContext2D, area: PrintArea) {
  const { x, y, w, h, cx } = area;

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#7dd3fc');
  sky.addColorStop(0.45, '#bae6fd');
  sky.addColorStop(1, '#ecfdf5');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Sun
  const sunGrad = ctx.createRadialGradient(cx, 70, 8, cx, 70, 55);
  sunGrad.addColorStop(0, '#fef08a');
  sunGrad.addColorStop(1, 'rgba(254,240,138,0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(x, y, w, h);

  // Mountains
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.moveTo(x, h);
  ctx.lineTo(x + w * 0.18, h * 0.42);
  ctx.lineTo(x + w * 0.34, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.22, h);
  ctx.lineTo(x + w * 0.48, h * 0.28);
  ctx.lineTo(x + w * 0.72, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.58, h);
  ctx.lineTo(x + w * 0.78, h * 0.38);
  ctx.lineTo(x + w, h);
  ctx.closePath();
  ctx.fill();

  // Trees
  const drawTree = (tx: number, th: number, scale: number) => {
    ctx.save();
    ctx.translate(tx, h);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#3f2d20';
    ctx.fillRect(-5, -th, 10, th);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(0, -th - 40);
    ctx.lineTo(28, -th + 4);
    ctx.lineTo(-28, -th + 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -th - 22);
    ctx.lineTo(24, -th + 16);
    ctx.lineTo(-24, -th + 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawTree(x + w * 0.12, 55, 1);
  drawTree(x + w * 0.88, 48, 0.9);
  drawTree(x + w * 0.06, 42, 0.75);

  ctx.fillStyle = '#14532d';
  ctx.font = '700 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Wild Morning', cx, h * 0.72);
}
