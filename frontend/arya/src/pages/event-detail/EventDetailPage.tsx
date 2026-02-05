import { Link, useParams } from 'react-router-dom';
import { useEvent } from '@/hooks/queries';

export const EventDetailPage = () => {
  const { id = '0' } = useParams();
  const { data: event } = useEvent(Number(id));
  if (!event) return <div className="empty-state"><div className="empty-art">🧭</div><p>رویداد پیدا نشد.</p></div>;

  return (
    <article className="grid panel-grid">
      <section className="grid">
        <div className="hero" style={{ gridTemplateColumns: '1fr' }}>
          <img src={event.banner} alt={event.title} />
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>{event.date} | {event.location}</p>
        </div>
        <div className="card">
          <h3>برنامه و ویژگی‌ها</h3>
          <ul className="timeline">
            {event.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </div>
        <div className="card"><h3>قوانین استرداد</h3><p>{event.refundPolicy}</p></div>
      </section>

      <aside className="grid">
        <div className="card">
          <span className="badge badge-glow">قیمت ویژه</span>
          <h2 style={{ marginTop: '.55rem', fontSize: '2rem' }}>{event.price.toLocaleString()} تومان</h2>
          <p style={{ marginTop: '.5rem' }}>ظرفیت رویداد در حال تکمیل است. ثبت‌نام را از دست نده.</p>
          <div style={{ marginTop: '.9rem', display: 'grid', gap: '.55rem' }}>
            <Link className="btn btn-primary" to={`/checkout/${event.type}/${event.id}`}>رزرو و پرداخت</Link>
            <Link className="btn btn-ghost" to="/events">بازگشت به رویدادها</Link>
          </div>
        </div>
        <div className="card">
          <h3>نبض جامعه</h3>
          <p className="muted">فضای نظرات و تجربه کاربران اینجا نمایش داده می‌شود تا حس اعتماد و هیجان قبل از حضور کامل شود.</p>
          <div className="alert-soft" style={{ marginTop: '.7rem' }}>بخش نظرات پس از فعال‌سازی API به همین ساختار اضافه می‌شود.</div>
        </div>
      </aside>
    </article>
  );
};
