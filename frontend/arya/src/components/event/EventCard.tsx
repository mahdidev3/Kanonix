import { Link } from 'react-router-dom';
import type { EventItem } from '@/types/domain';

const typeLabel: Record<EventItem['type'], string> = {
  festival: 'جشن',
  trip: 'اردو',
  market: 'بازارچه',
};

export const EventCard = ({ event }: { event: EventItem }) => (
  <article className={`card event-card ${event.status === 'past' ? 'archived' : ''}`}>
    <img src={event.banner} alt={event.title} className={event.status === 'past' ? 'past' : ''} />
    <div className="event-meta">
      <span className={`badge ${event.status === 'past' ? 'badge-archived' : 'badge-glow'}`}>{event.status === 'past' ? 'آرشیو' : 'فعال'}</span>
      <span className="badge">{typeLabel[event.type]}</span>
    </div>
    <h3>{event.title}</h3>
    <p className="muted">{event.date} - {event.location}</p>
    <p>{event.description}</p>
    <div style={{ marginTop: '.45rem', display: 'flex', gap: '.55rem' }}>
      <Link className="btn btn-primary" to={`/events/${event.id}`}>مشاهده جزئیات</Link>
    </div>
  </article>
);
