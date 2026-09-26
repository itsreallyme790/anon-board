'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNickname } from '@/lib/nickname';

export default function PostForm() {
  const [nick, setNick] = useState('Anon');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => { setNick(getNickname()); }, []);

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    if (!text.trim() && !file) return;
    setBusy(true);

    const fd = new FormData();
    fd.append('text', text);
    fd.append('nickname', nick);
    if (file) fd.append('image', file);

    const res = await fetch('/api/posts', { method: 'POST', body: fd });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert('Ошибка: ' + (data.error || res.status));
    }

    setText('');
    setFile(null);
    e.target.reset();
    setBusy(false);
    router.refresh();
    window.location.reload();
  }

  return (
    <form className="form-block" onSubmit={submit}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        placeholder="Что нового?"
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files[0] || null)}
      />
      <button type="submit" disabled={busy}>
        {busy ? 'Публикация…' : 'Опубликовать'}
      </button>
    </form>
  );
}