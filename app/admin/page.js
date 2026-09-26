import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminLogin({ searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin')?.value;
  if (isAdmin(token)) redirect('/admin/panel');

  const params = await searchParams;
  const hasError = params?.error;

  return (
    <div className="login-box">
      <h1>Вход в админку</h1>
      {hasError && <div className="login-error">Неверный пароль</div>}
      <form action="/api/admin/login" method="post">
        <input type="password" name="password" placeholder="Пароль" autoFocus />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}