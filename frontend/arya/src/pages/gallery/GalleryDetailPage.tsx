import { useParams } from 'react-router-dom';
import { useEvent } from '@/hooks/queries';

export const GalleryDetailPage = () => {
  const { id = '0' } = useParams();
  const { data: event } = useEvent(Number(id));
  if (!event) return <div className="card">گالری یافت نشد.</div>;
  return <section className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>{event.gallery.map((img) => <img key={img} src={img} className="card" />)}</section>;
};
