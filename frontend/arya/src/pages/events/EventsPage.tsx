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
  const activeCount = filtered.filter((item) => item.status === 'active').length;
  const pastCount = filtered.filter((item) => item.status === 'past').length;

  return (
    <section className="grid">
      <div>
        <h1 className="page-title">آرشیو و رویدادهای زنده</h1>
        <p>رویدادهای فعال با رنگ انرژی و گذشته‌ها در حالت آرشیو فرهنگی.</p>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '.7rem' }}>
        <select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }}>
          <option value="all">همه وضعیت‌ها</option><option value="active">فعال</option><option value="past">گذشته</option>
        </select>
        <select value={type} onChange={(event) => { setType(event.target.value as typeof type); setPage(1); }}>
          <option value="all">همه دسته‌ها</option><option value="festival">جشن</option><option value="trip">اردو</option><option value="market">بازارچه</option>
        </select>
        <div className="badge badge-glow">فعال: {activeCount}</div>
        <div className="badge badge-archived">آرشیو: {pastCount}</div>
      </div>

      {pageItems.length ? (
        <div className="grid event-grid">
          {pageItems.map((item) => <EventCard key={item.id} event={item} />)}
        </div>
      ) : (
        <div className="empty-state"><div className="empty-art">🎫</div><p>با این فیلتر، رویدادی پیدا نشد. یک ترکیب دیگر را امتحان کن.</p></div>
      )}

      <div style={{ display: 'flex', gap: '.55rem' }}>
        <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>قبلی</button>
        <button className="btn btn-secondary" disabled={page * PAGE_SIZE >= filtered.length} onClick={() => setPage((p) => p + 1)}>بعدی</button>
      </div>
    </section>
  );
};
