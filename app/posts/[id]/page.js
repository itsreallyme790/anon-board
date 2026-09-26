import { supabase } from '@/lib/supabase';
import VoteButtons from '@/components/VoteButtons';
import CommentForm from '@/components/CommentForm';
import CommentsList from '@/components/CommentsList';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }) {
  const { id } = await params;

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();
  const { data: comments } = await supabase
    .from('comments').select('*').eq('post_id', id).order('created_at');

  if (!post) return <main><p>Пост не найден</p></main>;

  return (
    <main>
      <a href="/" className="back-link">← на главную</a>

      <div className="post">
        <div className="meta">
          <b>{post.nickname || 'Anon'}</b>
          <span>·</span>
          <span>{new Date(post.created_at).toLocaleString('ru-RU')}</span>
        </div>
        {post.image_url && <img src={post.image_url} alt="" />}
        {post.text && <p className="text">{post.text}</p>}
        <VoteButtons targetType="post" targetId={post.id} likes={post.likes} dislikes={post.dislikes} />
      </div>

      <h3>Комментарии ({comments?.length || 0})</h3>
      <CommentForm postId={id} />
      <CommentsList comments={comments || []} />
    </main>
  );
}