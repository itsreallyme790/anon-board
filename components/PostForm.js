'use client';
import { useEffect, useState } from 'react';
import { getNickname } from '@/lib/nickname';

export default function PostForm() {
  const [nick, setNick] = useState('Anon');

  useEffect(() => { setNick(getNickname()); }, []);

  return (
    <form className="form-block" action="/api/posts" method="post" encType="multipart/form-data">
      <input type="hidden" name="nickname" value={nick} />
      <textarea name="text" rows={3} placeholder="Что нового?" />
      <input type="file" name="image" accept="image/*" />
      <button type="submit">Опубликовать</button>
    </form>
  );
}