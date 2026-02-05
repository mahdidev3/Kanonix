import { Outlet } from 'react-router-dom';

export const AuthLayout = () => (
  <main className="auth-shell">
    <section className="auth-page">
      <Outlet />
    </section>
  </main>
);
