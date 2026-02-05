export const RegisterPage = () => (
  <form className="card auth-card form-grid">
    <span className="badge">عضویت جدید</span>
    <h1 className="page-title">ثبت‌نام</h1>
    <p>پروفایل خودت را بساز تا به رویدادها دسترسی داشته باشی.</p>
    <label>نام و نام خانوادگی<input /></label>
    <label>شماره موبایل<input /></label>
    <label>رمز عبور<input type="password" /></label>
    <label>بخش همکاری<textarea placeholder="زمینه همکاری شما" /></label>
    <button className="btn btn-primary" type="submit">ایجاد حساب</button>
  </form>
);
