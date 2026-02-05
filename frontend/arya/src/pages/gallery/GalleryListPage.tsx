import { Link } from 'react-router-dom';
import { useEvents } from '@/hooks/queries';

export const GalleryListPage = () => {
  const { data: events = [] } = useEvents();

  return (
    <section className="grid">
      <div>
        <h1 className="page-title">گالری سینمایی</h1>
        <p>هر قاب، روایت یک تجربه جمعی.</p>
      </div>
      <div className="grid gallery-grid">
        {events.map((event) => (
          <article key={event.id} className="gallery-item card">
            <img src={event.banner} alt={event.title} />
            <div className="gallery-caption">
              <h3>{event.title}</h3>
              <Link className="btn btn-secondary" to={`/gallery/${event.id}`} style={{ marginTop: '.5rem', display: 'inline-flex' }}>مشاهده گالری</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
