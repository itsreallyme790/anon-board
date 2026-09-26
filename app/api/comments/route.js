import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export const runtime = 'nodejs';

function ipHash(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex');
}

export async function POST(req) {
  const body = await req.json();
  const postId = body.postId;
  const text = (body.text || '').trim().slice(0, 2000);
  const nickname = (body.nickname || 'Anon').trim().slice(0, 20) || 'Anon';

  if (!text || !postId) return NextResponse.json({ error: 'empty' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert({ post_id: postId, text, nickname, ip_hash: ipHash(req) })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}