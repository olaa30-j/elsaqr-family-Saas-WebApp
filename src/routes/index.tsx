import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorPage from '../views/errors/ErrorPage';
import PublicLayout from '../components/layouts/PublicLayout';
import ProtectedLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

const Home = lazy(() => import('../views/home/Home'));
const LoginPage = lazy(() => import('../views/auth/LoginPage'));
const RegisterPage = lazy(() => import('../views/auth/RegisterationPage'));

// protected routes
const DashboardPage = lazy(() => import('../views/dashboard/Dashboard'));
const ProfilePage = lazy(() => import('../views/dashboard/profile/ProfilePage'));
const AdminPage = lazy(() => import('../views/dashboard/admin/Admin'));
const UsersPage = lazy(() => import('../components/dashboard/free/admin/Users'));
const UserDetailsPage = lazy(() => import('../components/dashboard/free/admin/UserDetails'));
const FinancailPage = lazy(() => import('../views/dashboard/financail/FinancailPage'));

const NotFoundPage = lazy(() => import('../views/errors/NotFoundPage'));

const SuspenseLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    {children}
  </Suspense>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <SuspenseLoader>
            <Home />
          </SuspenseLoader>
        ),
      },
      {
        element: (
          <AuthLayout />
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'login',
            element: (
              <SuspenseLoader>
                <LoginPage />
              </SuspenseLoader>
            ),
          },
          {
            path: 'register',
            element: (
              <SuspenseLoader>
                <RegisterPage />
              </SuspenseLoader>
            ),
          },
        ],
      },
      {
        element: (
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'dashboard',
            element: (
              <SuspenseLoader>
                <DashboardPage />
              </SuspenseLoader>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseLoader>
                <ProfilePage />
              </SuspenseLoader>
            ),
          },
          {
            path: 'financail',
            element: (
              <SuspenseLoader>
                <FinancailPage />
              </SuspenseLoader>
            )
          },
          {
            path: 'admin',
            element: (
              <SuspenseLoader>
                <AdminPage />
              </SuspenseLoader>
            ),
            children: [
              {
                path: 'users',
                element: (
                  <SuspenseLoader>
                    <UsersPage />
                  </SuspenseLoader>
                ),
              },
              {
                path: 'users/:userId',
                element: (
                  <SuspenseLoader>
                    <UserDetailsPage />
                  </SuspenseLoader>
                ),
              }
            ],
          },
        ],
      },
      {
        path: '*',
        element: (
          <SuspenseLoader>
            <NotFoundPage />
          </SuspenseLoader>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

export default router;