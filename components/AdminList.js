'use client';
import { useRouter } from 'next/navigation';

export default function AdminList({ tab, posts, comments }) {
  const router = useRouter();

  async function del(type, id) {
    if (!confirm('Удалить ' + (type === 'post' ? 'пост' : 'коммент') + '?')) return;
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id })
    });
    if (res.ok) router.refresh();
    else alert('Ошибка удаления');
  }

  if (tab === 'comments') {
    if (!comments.length) return <p className="empty">Комментариев нет</p>;
    return (
      <div>
        {comments.map(c => (
          <div key={c.id} className="comment">
            <div className="meta">
              <b>{c.nickname || 'Anon'}</b>
              <span>·</span>
              <span>{new Date(c.created_at).toLocaleString('ru-RU')}</span>
              <span>·</span>
              <span>пост #{c.post_id}</span>
              <button className="del-btn" onClick={() => del('comment', c.id)}>удалить</button>
            </div>
            <p className="text">{c.text}</p>
            <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
              ∆ {c.likes} · ∇ {c.dislikes}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts.length) return <p className="empty">Постов нет</p>;
  return (
    <div>
      {posts.map(p => (
        <div key={p.id} className="post">
          <div className="meta">
            <b>{p.nickname || 'Anon'}</b>
            <span>·</span>
            <span>{new Date(p.created_at).toLocaleString('ru-RU')}</span>
            <button className="del-btn" onClick={() => del('post', p.id)}>удалить</button>
          </div>
          {p.image_url && <img src={p.image_url} alt="" />}
          {p.text && <p className="text">{p.text}</p>}
          <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
            ∆ {p.likes} · ∇ {p.dislikes}
          </div>
        </div>
      ))}
    </div>
  );
}