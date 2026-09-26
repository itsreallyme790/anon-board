import { NextResponse } from 'next/server';
import { adminToken } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req) {
  const form = await req.formData();
  const password = (form.get('password') || '').toString();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin?error=1', req.url));
  }

  const res = NextResponse.redirect(new URL('/admin/panel', req.url));
  res.cookies.set('admin', adminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}