import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export const runtime = 'nodejs';

function ipHash(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex');
}

export async function POST(req) {
  const form = await req.formData();
  const targetType = form.get('targetType');
  const targetId = Number(form.get('targetId'));
  const value = Number(form.get('value'));

  if (!['post', 'comment'].includes(targetType) || ![-1, 1].includes(value)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  await supabaseAdmin.rpc('vote', {
    p_target_type: targetType,
    p_target_id: targetId,
    p_ip_hash: ipHash(req),
    p_value: value
  });

  return NextResponse.redirect(req.headers.get('referer') || new URL('/', req.url));
}