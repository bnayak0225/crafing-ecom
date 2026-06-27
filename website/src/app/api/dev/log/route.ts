import { NextRequest, NextResponse } from 'next/server';

type LogBody = {
  source?: string;
  message?: string;
  details?: unknown;
  at?: string;
};

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: true });
  }

  let body: LogBody;
  try {
    body = (await req.json()) as LogBody;
  } catch (err) {
    console.error('[client] invalid log payload', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const source = body.source ?? 'client';
  const message = body.message ?? '(no message)';
  const at = body.at ? ` @ ${body.at}` : '';

  console.error(`[client:${source}]${at} ${message}`);
  if (body.details !== undefined && body.details !== null) {
    console.error('[client:details]', body.details);
  }

  return NextResponse.json({ ok: true });
}
