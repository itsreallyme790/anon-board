import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req) {
  const { type, id } = await req.json();
  if (!['post', 'comment'].includes(type) || !id) {
    return NextResponse.json({ error: 'bad' }, { status: 400 });
  }

  const table = type === 'post' ? 'posts' : 'comments';
  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}