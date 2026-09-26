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
  const text = (form.get('text') || '').toString().trim().slice(0, 5000);
  const nickname = (form.get('nickname') || 'Anon').toString().trim().slice(0, 20) || 'Anon';
  const file = form.get('image');

  let image_url = null;

  if (file && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл больше 5 МБ' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const name = crypto.randomBytes(16).toString('hex') + '.' + ext;

    const { error: upErr } = await supabaseAdmin.storage
      .from('images')
      .upload(name, Buffer.from(bytes), { contentType: file.type });

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { data } = supabaseAdmin.storage.from('images').getPublicUrl(name);
    image_url = data.publicUrl;
  }

  if (!text && !image_url) {
    return NextResponse.json({ error: 'empty' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('posts').insert({
    text, image_url, nickname, ip_hash: ipHash(req)
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}