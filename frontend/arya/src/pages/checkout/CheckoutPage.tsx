import { useParams } from 'react-router-dom';
import { SeatMap } from '@/components/checkout/SeatMap';
import { useSeats } from '@/hooks/queries';

export const CheckoutPage = () => {
  const { type } = useParams();
  const { data: seats = [] } = useSeats();

  return (
    <section className="grid">
      <h1>فرآیند پرداخت {type}</h1>
      {type === 'festival' && (
        <div className="card">
          <h3>نقشه صندلی (قوانین جنسیتی و ظرفیت اعمال شده)</h3>
          <SeatMap seats={seats} />
        </div>
      )}
      {type === 'trip' && (
        <div className="card grid">
          <label>تعداد نفرات<input type="number" defaultValue={1} /></label>
          <label>اطلاعات مسافر<textarea /></label>
        </div>
      )}
      {type === 'market' && (
        <div className="card grid">
          <label>انتخاب غرفه<select><option>غرفه A1</option></select></label>
          <label>اطلاعات فروشنده<textarea /></label>
          <label><input type="checkbox" /> قوانین بازارچه را می‌پذیرم</label>
        </div>
      )}
      <button className="btn btn-primary">تایید و پرداخت</button>
    </section>
  );
};
