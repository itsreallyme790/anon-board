import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req) {
  const res = NextResponse.redirect(new URL('/admin', req.url));
  res.cookies.set('admin', '', { path: '/', maxAge: 0 });
  return res;
}