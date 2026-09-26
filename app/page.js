import { supabaseAdmin } from '@/lib/supabase';
import NicknameBar from '@/components/NicknameBar';
import PostForm from '@/components/PostForm';
import VoteButtons from '@/components/VoteButtons';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: posts } = await supabaseAdmin
    .from('posts').select('*').order('created_at', { ascending: false }).limit(50);

  return (
    <main>
      <h1>Анонимная доска</h1>
      <NicknameBar />
      <PostForm />
      <hr />

      {posts?.length
        ? posts.map(p => (
            <div key={p.id} className="post">
              <div className="meta">
                <b>{p.nickname || 'Anon'}</b>
                <span>·</span>
                <span>{new Date(p.created_at).toLocaleString('ru-RU')}</span>
              </div>
              {p.image_url && <img src={p.image_url} alt="" />}
              {p.text && <p className="text">{p.text}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <VoteButtons targetType="post" targetId={p.id} likes={p.likes} dislikes={p.dislikes} />
                <a href={'/posts/' + p.id}>комментарии →</a>
              </div>
            </div>
          ))
        : <p className="empty">Постов пока нет</p>}
    </main>
  );
}