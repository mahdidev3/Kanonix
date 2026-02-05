import { Link, Outlet } from 'react-router-dom';
import { tenantConfig } from '@/features/tenant/config';

const links = [
  ['/', 'خانه'],
  ['/about', 'درباره ما'],
  ['/events', 'رویدادها'],
  ['/gallery', 'گالری'],
  ['/dashboard', 'پنل کاربری'],
  ['/admin', 'ادمین'],
  ['/ui-preview', 'UI Preview'],
];

export const AppLayout = () => (
  <div className="layout">
    <header className="header">
      <div className="container nav">
        <strong>{tenantConfig.name}</strong>
        <nav style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
          {links.map(([to, label]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
    <main className="main container">
      <Outlet />
    </main>
    <footer className="footer">
      <div className="container muted">
        {tenantConfig.contact.phone} | {tenantConfig.contact.email} | {tenantConfig.contact.instagram}
      </div>
    </footer>
  </div>
);
