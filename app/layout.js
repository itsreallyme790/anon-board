import './globals.css';

export const metadata = {
  title: 'Анонимный форум',
  description: 'Анонимные посты и комментарии'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}