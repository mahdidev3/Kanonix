import { Link } from 'react-router-dom';
import type { EventItem } from '@/types/domain';

export const EventCard = ({ event }: { event: EventItem }) => (
  <article className={`card event-card ${event.status === 'past' ? 'past' : ''}`}>
    <img src={event.banner} alt={event.title} />
    <h3>{event.title}</h3>
    <p className="muted">{event.date} - {event.location}</p>
    <p>{event.description}</p>
    <span className="badge">{event.type}</span>
    <div style={{ marginTop: '.8rem' }}>
      <Link className="btn btn-primary" to={`/events/${event.id}`}>مشاهده جزئیات</Link>
    </div>
  </article>
);
