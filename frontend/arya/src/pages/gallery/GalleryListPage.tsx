import { Link } from 'react-router-dom';
import { useEvents } from '@/hooks/queries';

export const GalleryListPage = () => {
  const { data: events = [] } = useEvents();
  return (
    <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      {events.map((event) => (
        <article key={event.id} className="card">
          <img src={event.banner} alt={event.title} />
          <h3>{event.title}</h3>
          <Link className="btn btn-primary" to={`/gallery/${event.id}`}>مشاهده گالری</Link>
        </article>
      ))}
    </section>
  );
};
