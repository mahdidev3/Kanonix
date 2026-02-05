import { Link, Outlet } from 'react-router-dom';
import { tenantConfig } from '@/features/tenant/config';
import { env } from '@/utils/env';
import { useAuthState } from '@/hooks/useAuthState';

const publicLinks = [
  ['/', 'خانه'],
  ['/about', 'درباره ما'],
  ['/events', 'رویدادها'],
  ['/gallery', 'گالری'],
] as const;

export const AppLayout = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthState();
  const showAuthLinks = !isLoading;
  const showAdminNav = isAuthenticated && isAdmin && env.enableAdminUi;

  return (
    <div className="layout">
      <header className="header">
        <div className="container nav">
          <strong className="brand"><span className="brand-mark" />{tenantConfig.name}</strong>
          <nav className="nav-links">
            {publicLinks.map(([to, label]) => (
              <Link key={to} to={to} className="nav-link">
                {label}
              </Link>
            ))}
            {showAuthLinks && (isAuthenticated ? (
              <Link to="/dashboard" className="nav-link">پنل کاربری</Link>
            ) : (
              <>
                <Link to="/auth/login" className="nav-link">ورود</Link>
                <Link to="/auth/register" className="nav-link">ثبت‌نام</Link>
              </>
            ))}
          </nav>
        </div>
        {showAdminNav && (
          <div className="container" style={{ paddingBottom: '.5rem' }}>
            <nav className="nav-links" aria-label="Admin navigation">
              <Link to="/admin" className="nav-link">ادمین</Link>
            </nav>
          </div>
        )}
      </header>
      <main className="main container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container muted" style={{ padding: '.95rem 0' }}>
          {tenantConfig.contact.phone} | {tenantConfig.contact.email} | {tenantConfig.contact.instagram}
        </div>
      </footer>
    </div>
  );
};
