import type { Council, EventItem, Seat, UserProfile } from '@/types/domain';

export const mockEvents: EventItem[] = [
  {
    id: 1,
    title: 'جشن بزرگ نیمسال',
    type: 'festival',
    status: 'active',
    date: '1405/02/20',
    price: 250000,
    description: 'جشن رسمی همراه با برنامه‌های فرهنگی، موسیقی و مسابقه.',
    location: 'سالن شهید آوینی',
    banner: '/src/assets/images/poster-1.svg',
    features: ['پذیرایی کامل', 'اجرای زنده', 'جوایز ویژه'],
    refundPolicy: 'استرداد تا ۴۸ ساعت قبل از رویداد مجاز است.',
    seatsLeft: 120,
    gallery: ['/src/assets/images/gallery-1.svg', '/src/assets/images/gallery-2.svg'],
  },
  {
    id: 2,
    title: 'اردوی شمال',
    type: 'trip',
    status: 'active',
    date: '1405/03/05',
    price: 1800000,
    description: 'سفر سه روزه با برنامه طبیعت‌گردی و اقامت کامل.',
    location: 'مازندران',
    banner: '/src/assets/images/poster-2.svg',
    features: ['اتوبوس VIP', 'بیمه سفر', 'راهنمای تور'],
    refundPolicy: 'تا ۷ روز قبل ۸۰٪ مبلغ عودت داده می‌شود.',
    seatsLeft: 22,
    gallery: ['/src/assets/images/gallery-3.svg'],
  },
  {
    id: 3,
    title: 'بازارچه کارآفرینی',
    type: 'market',
    status: 'past',
    date: '1404/11/15',
    price: 450000,
    description: 'ثبت‌نام غرفه برای فروش محصولات دانشجویی.',
    location: 'حیاط مرکزی دانشگاه',
    banner: '/src/assets/images/poster-1.svg',
    features: ['غرفه ۲×۲', 'تبلیغات محیطی'],
    refundPolicy: 'برای غرفه تاییدشده امکان استرداد وجود ندارد.',
    gallery: ['/src/assets/images/gallery-4.svg'],
  },
];

export const mockCouncils: Council[] = [
  { id: 1, period: '1405', members: ['نرگس احمدی', 'علی رضایی', 'مریم حسینی'], active: true },
  { id: 2, period: '1404', members: ['محمد قربانی', 'الهام کریمی'], active: false },
];

export const mockSeats: Seat[] = Array.from({ length: 30 }).map((_, index) => {
  const number = index + 1;
  return {
    id: `A-${number}`,
    row: 'A',
    number,
    gender: number % 2 === 0 ? 'female' : 'male',
    price: number <= 10 ? 300000 : 250000,
    status: number % 7 === 0 ? 'blocked' : number % 5 === 0 ? 'reserved' : 'available',
  };
});

export const mockProfile: UserProfile = {
  fullName: 'کاربر نمونه آریا',
  phone: '09120000000',
  collaboration: 'فعال در تیم رسانه',
  attendedEventIds: [3],
  role: 'user',
};

export const mockReports = [
  { name: 'گزارش فروش جشن', total: 125000000, registrations: 520 },
  { name: 'گزارش اردوی شمال', total: 47000000, registrations: 60 },
];
