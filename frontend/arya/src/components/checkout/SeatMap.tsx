import type { Seat } from '@/types/domain';

export const SeatMap = ({ seats }: { seats: Seat[] }) => (
  <div className="seat-grid">
    {seats.map((seat) => (
      <div key={seat.id} className={`seat ${seat.status}`}>
        <strong>{seat.id}</strong>
        <div>{seat.gender === 'male' ? 'آقا' : seat.gender === 'female' ? 'خانم' : 'آزاد'}</div>
      </div>
    ))}
  </div>
);
