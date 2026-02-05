import { useEvents, useReports } from '@/hooks/queries';
import { ReportsTable } from '@/components/admin/ReportsTable';

export const AdminPage = () => {
  const { data: events = [] } = useEvents();
  const { data: reports = [] } = useReports();
  return (
    <section className="grid">
      <div className="card"><h2>مدیریت رویدادها</h2>{events.map((event) => <p key={event.id}>{event.title}</p>)}</div>
      <div className="card"><h2>کاربران / ثبت‌نام‌ها</h2><p>لیست و جستجو کاربران ثبت‌نامی</p></div>
      <div className="card"><h2>مدیریت نقشه صندلی</h2><p>نمایش وضعیت رزرو و قفل صندلی‌ها</p></div>
      <div className="card"><h2>تایید غرفه بازارچه</h2><p>بررسی اطلاعات فروشندگان</p></div>
      <ReportsTable reports={reports} />
    </section>
  );
};
