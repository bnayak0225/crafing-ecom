export type PrintArea = {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
};

export function roundRect(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(rx + r, ry);
  ctx.lineTo(rx + width - r, ry);
  ctx.quadraticCurveTo(rx + width, ry, rx + width, ry + r);
  ctx.lineTo(rx + width, ry + height - r);
  ctx.quadraticCurveTo(rx + width, ry + height, rx + width - r, ry + height);
  ctx.lineTo(rx + r, ry + height);
  ctx.quadraticCurveTo(rx, ry + height, rx, ry + height - r);
  ctx.lineTo(rx, ry + r);
  ctx.quadraticCurveTo(rx, ry, rx + r, ry);
  ctx.closePath();
}

export function drawStars(
  ctx: CanvasRenderingContext2D,
  count: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i += 1) {
    const x = (i * 173 + 41) % w;
    const y = (i * 97 + 23) % h;
    const r = 0.6 + (i % 4) * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}
