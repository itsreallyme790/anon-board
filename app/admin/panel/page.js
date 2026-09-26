import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin';
import AdminList from '@/components/AdminList';

export const dynamic = 'force-dynamic';

export default async function AdminPanel({ searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin')?.value;
  if (!isAdmin(token)) redirect('/admin');

  const params = await searchParams;
  const tab = params?.tab === 'comments' ? 'comments' : 'posts';

  const { data: posts } = await supabase
    .from('posts').select('*').order('created_at', { ascending: false }).limit(200);

  const { data: comments } = await supabase
    .from('comments').select('*').order('created_at', { ascending: false }).limit(200);

  return (
    <main>
      <div className="admin-top">
        <h1>Админка</h1>
        <form action="/api/admin/logout" method="post" style={{ display: 'inline' }}>
          <button type="submit">Выйти</button>
        </form>
      </div>

      <div className="admin-tabs">
        <a href="/admin/panel?tab=posts" className={tab === 'posts' ? 'active' : ''}>Посты</a>
        <a href="/admin/panel?tab=comments" className={tab === 'comments' ? 'active' : ''}>Комментарии</a>
      </div>

      <AdminList tab={tab} posts={posts || []} comments={comments || []} />
    </main>
  );
}