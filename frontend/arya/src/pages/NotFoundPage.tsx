import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="card">
    <h1>404</h1>
    <p>صفحه مورد نظر پیدا نشد.</p>
    <Link to="/" className="btn btn-primary">بازگشت به خانه</Link>
  </div>
);
