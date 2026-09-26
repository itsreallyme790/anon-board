import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';

export const runtime = 'nodejs';

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin')?.value;
  if (!isAdmin(token)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { type, id } = await req.json();
  if (!['post', 'comment'].includes(type) || !id) {
    return NextResponse.json({ error: 'bad' }, { status: 400 });
  }

  const table = type === 'post' ? 'posts' : 'comments';
  await supabaseAdmin.from(table).delete().eq('id', id);
  return NextResponse.json({ ok: true });
}