import { NextResponse } from 'next/server';

export async function GET() {
  const response = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  };
  return NextResponse.json(response);
}
