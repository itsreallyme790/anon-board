'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VoteButtons from './VoteButtons';

export default function CommentsList({ comments }) {
  const [mine, setMine] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setMine(JSON.parse(localStorage.getItem('my_comments') || '[]'));
  }, [comments]);

  async function del(id) {
    if (!confirm('Удалить комментарий?')) return;
    await fetch('/api/comments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId: id })
    });
    const ids = JSON.parse(localStorage.getItem('my_comments') || '[]').filter(x => x !== id);
    localStorage.setItem('my_comments', JSON.stringify(ids));
    router.refresh();
  }

  if (!comments?.length) return <p className="empty">Пока нет комментариев</p>;

  return (
    <div>
      {comments.map(c => (
        <div key={c.id} className="comment">
          <div className="meta">
            <b>{c.nickname || 'Anon'}</b>
            <span>·</span>
            <span>{new Date(c.created_at).toLocaleString('ru-RU')}</span>
            {mine.includes(c.id) && (
              <button className="del-btn" onClick={() => del(c.id)}>удалить</button>
            )}
          </div>
          <p className="text">{c.text}</p>
          <VoteButtons targetType="comment" targetId={c.id} likes={c.likes} dislikes={c.dislikes} />
        </div>
      ))}
    </div>
  );
}