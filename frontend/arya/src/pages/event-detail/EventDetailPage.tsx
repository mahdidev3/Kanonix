import { Link, useParams } from 'react-router-dom';
import { useEvent } from '@/hooks/queries';

export const EventDetailPage = () => {
  const { id = '0' } = useParams();
  const { data: event } = useEvent(Number(id));
  if (!event) return <div className="card">رویداد پیدا نشد.</div>;

  return (
    <article className="grid">
      <img src={event.banner} alt={event.title} className="card" />
      <div className="card">
        <h1>{event.title}</h1>
        <p>{event.date} | {event.location}</p>
        <p>قیمت: {event.price.toLocaleString()} تومان</p>
        <Link className="btn btn-primary" to={`/checkout/${event.type}/${event.id}`}>ثبت‌نام</Link>
      </div>
      <div className="card"><h3>توضیحات</h3><p>{event.description}</p></div>
      <div className="card"><h3>برنامه و ویژگی‌ها</h3><ul>{event.features.map((f) => <li key={f}>{f}</li>)}</ul></div>
      <div className="card"><h3>قوانین استرداد</h3><p>{event.refundPolicy}</p></div>
      <div className="card"><h3>نظرات</h3><p className="muted">در صورت فعال بودن API نمایش داده می‌شود.</p></div>
    </article>
  );
};
