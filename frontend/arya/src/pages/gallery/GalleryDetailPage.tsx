import { useParams } from 'react-router-dom';
import { useEvent } from '@/hooks/queries';

export const GalleryDetailPage = () => {
  const { id = '0' } = useParams();
  const { data: event } = useEvent(Number(id));
  if (!event) return <div className="empty-state"><div className="empty-art">🖼️</div><p>گالری یافت نشد.</p></div>;

  return (
    <section className="grid">
      <h1 className="page-title">{event.title}</h1>
      <div className="grid gallery-grid">
        {event.gallery.map((img) => (
          <article key={img} className="gallery-item card-flat">
            <img src={img} alt={event.title} />
          </article>
        ))}
      </div>
    </section>
  );
};
