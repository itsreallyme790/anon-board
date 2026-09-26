'use client';
import { useEffect, useState } from 'react';
import { getNickname, setNickname } from '@/lib/nickname';

export default function NicknameBar() {
  const [nick, setNick] = useState('');

  useEffect(() => { setNick(getNickname()); }, []);

  function save() {
    const clean = nick.trim().slice(0, 20) || 'Anon';
    setNickname(clean);
    setNick(clean);
    location.reload();
  }

  return (
    <div className="nick-row">
      <span>Твой ник:</span>
      <input value={nick} onChange={e => setNick(e.target.value)} maxLength={20} />
      <button onClick={save}>Сохранить</button>
    </div>
  );
}