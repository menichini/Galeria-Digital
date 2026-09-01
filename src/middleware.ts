import { NextResponse } from 'next/server';

// Simple in‑memory rate limiter (per IP)
const LIMIT = 20; // max requests per minute
const WINDOW_MS = 60 * 1000;
const store = new Map<string, { count: number; reset: number }>();

export function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const entry = store.get(ip) ?? { count: 0, reset: now + WINDOW_MS };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + WINDOW_MS;
  }

  if (entry.count >= LIMIT) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  entry.count += 1;
  store.set(ip, entry);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/upload/:path*', '/api/admin/:path*'],
};
