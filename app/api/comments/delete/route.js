import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export const runtime = 'nodejs';

function ipHash(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex');
}

export async function POST(req) {
  const { commentId } = await req.json();
  if (!commentId) return NextResponse.json({ error: 'no id' }, { status: 400 });

  const { data: comment } = await supabaseAdmin
    .from('comments').select('ip_hash').eq('id', commentId).single();

  if (!comment || comment.ip_hash !== ipHash(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  await supabaseAdmin.from('comments').delete().eq('id', commentId);
  return NextResponse.json({ ok: true });
}