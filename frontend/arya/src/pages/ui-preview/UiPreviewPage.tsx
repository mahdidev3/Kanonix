import { EventCard } from '@/components/event/EventCard';
import { SeatMap } from '@/components/checkout/SeatMap';
import { useEvents, useReports, useSeats } from '@/hooks/queries';
import { ReportsTable } from '@/components/admin/ReportsTable';

export const UiPreviewPage = () => {
  const { data: events = [] } = useEvents();
  const { data: seats = [] } = useSeats();
  const { data: reports = [] } = useReports();

  return (
    <section className="grid">
      <div className="card"><h2>رنگ و تایپوگرافی</h2><p>نمونه متن فارسی برای بررسی فونت.</p><button className="btn btn-primary">دکمه اصلی</button></div>
      <div className="hero"><div><h2>Hero</h2><p>پیش‌نمایش بنر صفحه اصلی</p></div><img src={events[0]?.banner} /></div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>{events.map((event) => <EventCard key={event.id} event={event} />)}</div>
      <div className="card"><h3>Seat Map</h3><SeatMap seats={seats} /></div>
      <div className="card"><h3>Checkout Form</h3><input placeholder="نام" /><input placeholder="شماره تماس" /></div>
      <div className="card"><h3>Auth Form</h3><input placeholder="موبایل" /><input placeholder="رمز" /></div>
      <div className="card"><h3>Dashboard Widget</h3><p>رویداد فعال: ۲</p></div>
      <ReportsTable reports={reports} />
    </section>
  );
};
