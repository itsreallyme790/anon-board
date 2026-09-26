export function getNickname() {
  if (typeof window === 'undefined') return 'Anon';
  let nick = localStorage.getItem('nick');
  if (!nick) {
    nick = 'Anon-' + Math.random().toString(16).slice(2, 6);
    localStorage.setItem('nick', nick);
  }
  return nick;
}

export function setNickname(nick) {
  localStorage.setItem('nick', nick);
}