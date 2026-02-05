import { Link } from 'react-router-dom';
import { useEvents, useProfile } from '@/hooks/queries';
import { tenantConfig } from '@/features/tenant/config';
import { EventCard } from '@/components/event/EventCard';

export const HomePage = () => {
  const { data: events = [] } = useEvents();
  const { data: profile } = useProfile();
  const activeEvents = events.filter((event) => event.status === 'active');

  return (
    <>
      <aside className="marquee-strip">
        {events.slice(0, 7).map((event) => (
          <div
            key={event.id}
            className={`marquee-logo ${profile?.attendedEventIds.includes(event.id) ? 'is-active' : ''} ${event.status === 'past' ? 'is-past' : ''}`}
            title={event.title}
          >
            <img src={event.banner} alt={event.title} />
          </div>
        ))}
      </aside>

      <section className="hero">
        <div>
          <span className="badge badge-glow">جامعه فرهنگی نسل نو</span>
          <h1>{tenantConfig.name}</h1>
          <p>از جشن‌های بزرگ تا اردوهای خاطره‌ساز و بازارچه‌های خلاق؛ تجربه ثبت‌نام یکپارچه برای جامعه دانشجویی پرانرژی.</p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/events">ورود به رویدادها</Link>
            <Link className="btn btn-secondary" to="/gallery">تماشای لحظه‌ها</Link>
          </div>
        </div>
        <img src={tenantConfig.assets.hero} alt="hero" />
      </section>

      <section className="scene grid kpi-grid">
        <div className="kpi"><p>رویداد فعال</p><h3>{activeEvents.length}</h3></div>
        <div className="kpi"><p>تجربه برگزار شده</p><h3>{events.filter((event) => event.status === 'past').length}</h3></div>
        <div className="kpi"><p>لحظه ثبت‌شده</p><h3>{events.flatMap((event) => event.gallery).length}</h3></div>
      </section>

      <section className="scene">
        <h2 className="section-title">رویدادهای پیش‌رو</h2>
        <p>پویاترین برنامه‌ها برای هفته‌های آینده.</p>
        {activeEvents.length ? (
          <div className="grid event-grid" style={{ marginTop: '1rem' }}>
            {activeEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="empty-state" style={{ marginTop: '1rem' }}><div className="empty-art">✨</div><p>به‌زودی موج جدید رویدادها می‌رسد.</p></div>
        )}
      </section>

      <section className="scene">
        <h2 className="section-title">لحظه‌ها</h2>
        <div className="grid gallery-grid" style={{ marginTop: '1rem' }}>
          {events.flatMap((event) => event.gallery).slice(0, 4).map((image) => (
            <article key={image} className="gallery-item card-flat">
              <img src={image} alt="gallery" />
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
