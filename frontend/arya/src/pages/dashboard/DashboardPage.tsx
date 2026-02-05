import { useEvents, useProfile } from '@/hooks/queries';

export const DashboardPage = () => {
  const { data: profile } = useProfile();
  const { data: events = [] } = useEvents();
  if (!profile) return <div className="empty-state"><div className="empty-art">👤</div><p>اطلاعات پروفایل در دسترس نیست.</p></div>;

  const attended = events.filter((event) => profile.attendedEventIds.includes(event.id));

  return (
    <section className="grid panel-grid">
      <div className="grid">
        <div className="card">
          <h1 className="page-title">سلام {profile.fullName}</h1>
          <p>{profile.phone}</p>
          <div className="badge" style={{ marginTop: '.8rem', width: 'fit-content' }}>همکاری: {profile.collaboration}</div>
        </div>

        <div className="card">
          <h2 className="section-title">رویدادهای من</h2>
          {events.length ? events.map((event) => (
            <p key={event.id}>{event.title}<span className={`status-pill ${event.status === 'active' ? 'status-active' : 'status-past'}`}>{event.status === 'active' ? 'در حال برگزاری' : 'آرشیو شده'}</span></p>
          )) : <div className="empty-state"><div className="empty-art">🎭</div><p>هنوز رویدادی ثبت نشده.</p></div>}
        </div>
      </div>

      <aside className="grid">
        <div className="card">
          <h2 className="section-title">تاریخچه حضور</h2>
          {attended.length ? attended.map((event) => <p key={event.id}>{event.title}</p>) : <div className="empty-state"><div className="empty-art">📚</div><p>تاریخچه خالی است؛ از رویداد بعدی شروع کن.</p></div>}
        </div>
      </aside>
    </section>
  );
};
