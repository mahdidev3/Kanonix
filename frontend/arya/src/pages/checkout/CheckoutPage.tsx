import { useParams } from 'react-router-dom';
import { SeatMap } from '@/components/checkout/SeatMap';
import { useSeats } from '@/hooks/queries';

export const CheckoutPage = () => {
  const { type } = useParams();
  const { data: seats = [] } = useSeats();

  return (
    <section className="grid checkout-layout">
      <div className="card">
        <h1 className="page-title">فرآیند پرداخت {type}</h1>
        <p>با چند مرحله ساده، ثبت‌نام شما نهایی می‌شود.</p>
        <div className="steps">
          <span className="step active">انتخاب</span>
          <span className="step">اطلاعات</span>
          <span className="step">پرداخت</span>
          <span className="step">تایید</span>
        </div>

        {type === 'festival' && (
          <div className="scene">
            <h3>نقشه صندلی</h3>
            <p>موقعیت‌های قابل انتخاب با رنگ سبز مشخص‌اند.</p>
            <SeatMap seats={seats} />
          </div>
        )}
        {type === 'trip' && (
          <div className="scene form-grid">
            <label>تعداد نفرات<input type="number" defaultValue={1} /></label>
            <label>اطلاعات مسافر<textarea /></label>
          </div>
        )}
        {type === 'market' && (
          <div className="scene form-grid">
            <label>انتخاب غرفه<select><option>غرفه A1</option></select></label>
            <label>اطلاعات فروشنده<textarea /></label>
            <label><input type="checkbox" /> قوانین بازارچه را می‌پذیرم</label>
          </div>
        )}
      </div>

      <aside className="card">
        <h3>خلاصه سفارش</h3>
        <p>قبل از پرداخت، جزئیات را یک‌بار مرور کن.</p>
        <div className="alert-soft" style={{ marginTop: '.85rem' }}>در صورت تکمیل ظرفیت، گزینه‌های دیگر به شما پیشنهاد می‌شود.</div>
        <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>تایید و پرداخت</button>
      </aside>
    </section>
  );
};
