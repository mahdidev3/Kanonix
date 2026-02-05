import { useCouncils } from '@/hooks/queries';

export const AboutPage = () => {
  const { data: councils = [] } = useCouncils();
  return (
    <section className="grid">
      <article className="card"><h1>تاریخچه و اهداف</h1><p>کانون آریا با هدف رشد فرهنگی و اجتماعی دانشجویان فعالیت می‌کند.</p></article>
      <article className="card"><h2>شورای فعلی</h2><p>404 - اطلاعات شورای فعلی هنوز منتشر نشده است.</p></article>
      <article className="card"><h2>شوراهای گذشته</h2>{councils.filter((c) => !c.active).map((c) => <p key={c.id}>{c.period}: {c.members.join(' - ')}</p>)}</article>
    </section>
  );
};
