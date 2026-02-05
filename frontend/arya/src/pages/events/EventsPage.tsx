import { useMemo, useState } from 'react';
import { EventCard } from '@/components/event/EventCard';
import { useEvents } from '@/hooks/queries';

const PAGE_SIZE = 6;

export const EventsPage = () => {
  const { data: events = [] } = useEvents();
  const [status, setStatus] = useState<'all' | 'active' | 'past'>('all');
  const [type, setType] = useState<'all' | 'festival' | 'trip' | 'market'>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      events.filter(
        (event) =>
          (status === 'all' || event.status === status) && (type === 'all' || event.type === type),
      ),
    [events, status, type],
  );

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <div className="card" style={{ display: 'flex', gap: '.7rem' }}>
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
          <option value="all">همه وضعیت‌ها</option><option value="active">فعال</option><option value="past">گذشته</option>
        </select>
        <select value={type} onChange={(event) => setType(event.target.value as typeof type)}>
          <option value="all">همه دسته‌ها</option><option value="festival">جشن</option><option value="trip">اردو</option><option value="market">بازارچه</option>
        </select>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', marginTop: '1rem' }}>
        {pageItems.map((item) => <EventCard key={item.id} event={item} />)}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>قبلی</button>
        <button className="btn" disabled={page * PAGE_SIZE >= filtered.length} onClick={() => setPage((p) => p + 1)}>بعدی</button>
      </div>
    </section>
  );
};
