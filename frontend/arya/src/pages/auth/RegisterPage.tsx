export const RegisterPage = () => (
  <form className="card grid">
    <h1>ثبت‌نام</h1>
    <label>نام و نام خانوادگی<input /></label>
    <label>شماره موبایل<input /></label>
    <label>رمز عبور<input type="password" /></label>
    <label>بخش همکاری<textarea placeholder="زمینه همکاری شما" /></label>
    <button className="btn btn-primary" type="submit">ایجاد حساب</button>
  </form>
);
