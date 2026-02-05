import { useEvents, useProfile } from '@/hooks/queries';

export const DashboardPage = () => {
  const { data: profile } = useProfile();
  const { data: events = [] } = useEvents();
  if (!profile) return null;
  const attended = events.filter((event) => profile.attendedEventIds.includes(event.id));
  return (
    <section className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
      <div className="card"><h2>پروفایل</h2><p>{profile.fullName}</p><p>{profile.phone}</p></div>
      <div className="card"><h2>همکاری</h2><p>{profile.collaboration}</p></div>
      <div className="card"><h2>رویدادهای من</h2>{events.map((e) => <p key={e.id}>{e.title} - {e.status === 'active' ? 'فعال' : 'گذشته'}</p>)}</div>
      <div className="card"><h2>شرکت‌کرده‌ها</h2>{attended.map((event) => <p key={event.id}>{event.title}</p>)}</div>
    </section>
  );
};
