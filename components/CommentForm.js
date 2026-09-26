'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNickname } from '@/lib/nickname';

export default function CommentForm({ postId }) {
  const [nick, setNick] = useState('Anon');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => { setNick(getNickname()); }, []);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, text, nickname: nick })
    });
    const data = await res.json();
    if (data.id) {
      const ids = JSON.parse(localStorage.getItem('my_comments') || '[]');
      ids.push(data.id);
      localStorage.setItem('my_comments', JSON.stringify(ids));
    }
    setText('');
    setBusy(false);
    router.refresh();
  }

  return (
    <form className="form-block" onSubmit={submit}>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={2} placeholder="Комментарий" />
      <button type="submit" disabled={busy}>{busy ? 'Отправка…' : 'Отправить'}</button>
    </form>
  );
}