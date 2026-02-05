import { Link } from 'react-router-dom';
import { useEvents, useProfile } from '@/hooks/queries';
import { tenantConfig } from '@/features/tenant/config';
import { EventCard } from '@/components/event/EventCard';

export const HomePage = () => {
  const { data: events = [] } = useEvents();
  const { data: profile } = useProfile();
  return (
    <>
      <aside className="sidebar-logos">
        {events.map((event) => (
          <img key={event.id} src={event.banner} className={profile?.attendedEventIds.includes(event.id) ? '' : 'past'} />
        ))}
      </aside>
      <section className="hero">
        <div>
          <h1>{tenantConfig.name}</h1>
          <p>ثبت‌نام رویدادهای فرهنگی، اردوها و بازارچه به‌صورت آنلاین.</p>
          <Link className="btn btn-primary" to="/events">ثبت نام فوری</Link>
        </div>
        <img src={tenantConfig.assets.hero} alt="hero" />
      </section>
      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: '1rem' }}>
        <div className="card"><h3>دسته اردو</h3></div>
        <div className="card"><h3>دسته جشن</h3></div>
      </section>
      <h2>رویدادهای پیش‌رو</h2>
      <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        {events.filter((event) => event.status === 'active').map((event) => <EventCard key={event.id} event={event} />)}
      </section>
      <h2>لحظه‌ها</h2>
      <section className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {events.flatMap((event) => event.gallery).slice(0, 4).map((image) => <img key={image} src={image} className="card" />)}
      </section>
    </>
  );
};
