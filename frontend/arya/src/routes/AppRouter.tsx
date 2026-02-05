import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { HomePage } from '@/pages/home/HomePage';
import { AboutPage } from '@/pages/about/AboutPage';
import { EventsPage } from '@/pages/events/EventsPage';
import { EventDetailPage } from '@/pages/event-detail/EventDetailPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { CheckoutPage } from '@/pages/checkout/CheckoutPage';
import { GalleryListPage } from '@/pages/gallery/GalleryListPage';
import { GalleryDetailPage } from '@/pages/gallery/GalleryDetailPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { UiPreviewPage } from '@/pages/ui-preview/UiPreviewPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'checkout/:type/:id', element: <CheckoutPage /> },
      { path: 'gallery', element: <GalleryListPage /> },
      { path: 'gallery/:id', element: <GalleryDetailPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'ui-preview', element: <UiPreviewPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
