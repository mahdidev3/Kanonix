export const LoginPage = () => (
  <form className="card auth-card form-grid">
    <span className="badge badge-glow" style={{ width: 'fit-content' }}>خوش برگشتی</span>
    <h1 className="page-title">ورود</h1>
    <p>به جامعه فرهنگی آریا کانون وارد شو.</p>
    <label>شماره موبایل<input placeholder="09xxxxxxxxx" /></label>
    <label>رمز عبور<input type="password" placeholder="••••••••" /></label>
    <button className="btn btn-primary" type="submit">ورود</button>
  </form>
);
