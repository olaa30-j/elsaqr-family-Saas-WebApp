import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorPage from '../views/errors/ErrorPage';
import PublicLayout from '../components/layouts/PublicLayout';
import ProtectedLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import type { PermissionEntity, PermissionAction } from '../types/permissionsStructure';

declare module 'react-router-dom' {
  interface Handle {
    permissions: { entity: PermissionEntity; action: PermissionAction }[];
    permissionDescription?: string;
    requiresServerCheck?: boolean;
  }
}
const Home = lazy(() => import('../views/home/Home'));
const LoginPage = lazy(() => import('../views/auth/LoginPage'));
const RegisterPage = lazy(() => import('../views/auth/RegisterationPage'));
const ForgetPasswordPage = lazy(() => import('../components/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../components/auth/ResetPasswordPage'));
const ContactUsPage = lazy(() => import('../views/contactus/ContactUs'));

const DashboardPage = lazy(() => import('../views/dashboard/Dashboard'));
const ProfilePage = lazy(() => import('../views/dashboard/profile/ProfilePage'));
const AdminPage = lazy(() => import('../views/dashboard/admin/Admin'));

const UsersPage = lazy(() => import('../components/dashboard/free/admin/Users'));
const EditUserPage = lazy(() => import('../components/dashboard/free/users/EditUsers'));

const FinancialPage = lazy(() => import('../views/dashboard/financial/FinancialPage'));
const TransactionDetailsPage = lazy(() => import('../components/dashboard/free/financail/TransactionDetails'));

const AlbumsPage = lazy(() => import('../views/album/AlbumsPage'));
const AlbumsDetailsPage = lazy(() => import('../views/album/AlbumDetailPage'));

const AdminDashboardPage = lazy(() => import('../views/dashboard/admin/dashboard/AdminDashoard'));
const BranchesPage = lazy(() => import('../views/dashboard/admin/BranchesPage'));

const StatisticsPage = lazy(() => import('../views/dashboard/admin/StatisticsPage'));

const EventsPage = lazy(() => import('../components/dashboard/free/events/EventCalendar'));

const MembersPage = lazy(() => import('../components/dashboard/free/admin/Member'));
const MembersDeatilsPage = lazy(() => import('../components/dashboard/free/members/EditMember'));

const AdvertisementPage = lazy(() => import('../components/dashboard/free/advertisement/AdvertisementTable'));

const RolesPage = lazy(() => import('../components/dashboard/free/roles/Roles'));
const RolesPermissionsPage = lazy(() => import('../components/dashboard/free/roles/RolePermissions'));

const FamilyTreePage = lazy(() => import('../views/dashboard/familyTree/FamilyTreePage'));
const NestedTreePage = lazy(() => import('../components/dashboard/free/members/ChildFamilyTree'));

const NotificationSettingsPage = lazy(() => import('../views/dashboard/admin/NotificationSettingsPage'));

const AdDetailsPage = lazy(() => import('../components/dashboard/free/advertisement/AdDetails'));
const EditAdPage = lazy(() => import('../components/dashboard/free/advertisement/EditAd'));

const NotFoundPage = lazy(() => import('../views/errors/NotFoundPage'));

const SuspenseLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    {children}
  </Suspense>
);

const routePermissions = {
  advertisement: {
    permissions: [{ entity: 'اعلان', action: 'view' }],
    description: 'إدارة الإعلانات'
  },
  'advertisement-details/:id': {
    permissions: [{ entity: 'اعلان', action: 'view' }],
    description: 'إدارة الإعلانات'
  },
  'advertisement-edit/:id': {
    permissions: [{ entity: 'اعلان', action: 'update' }],
    description: 'إدارة الإعلانات'
  },
  financial: {
    permissions: [{ entity: 'ماليه', action: 'view' }],
    description: 'الصفحة المالية',
    requiresServerCheck: true
  },
  'financial/:id': {
    permissions: [{ entity: 'ماليه', action: 'view' }],
    description: 'تفاصيل المعاملة المالية'
  },
  'family-tree/:branch': {
    permissions: [{ entity: 'مستخدم', action: 'view' }],
    description: 'شجرة العائلة'
  },
  'nested-tree/:memberId': {
    permissions: [{ entity: 'مستخدم', action: 'view' }],
    description: 'شجرة العائلة'
  },
  albums: {
    permissions: [{ entity: 'معرض الصور', action: 'view' }],
    description: 'معرض الصور'
  },
  events: {
    permissions: [{ entity: 'مناسبه', action: 'view' }],
    description: 'المناسبات والأحداث'
  },
  'albums/:id': {
    permissions: [{ entity: 'معرض الصور', action: 'view' }],
    description: 'تفاصيل الألبوم'
  },
  'admin/users': {
    permissions: [
      { entity: 'عضو', action: 'view' },
      { entity: 'عضو', action: 'update' }
    ],
    description: 'إدارة المستخدمين',
    requiresServerCheck: true
  },
  'admin/users/:userId': {
    permissions: [{ entity: 'عضو', action: 'create' }],
    description: 'تعديل مستخدم'
  },
  'admin/members': {
    permissions: [{ entity: 'عضو', action: 'view' }],
    description: 'إدارة الأعضاء'
  },
  'admin/members/:memberId': {
    permissions: [{ entity: 'عضو', action: 'create' }],
    description: 'تعديل عضو'
  },
  'admin/roles-permissions': {
    permissions: [{ entity: 'عضو', action: 'update' }],
    description: 'إدارة الصلاحيات والأدوار',
    requiresServerCheck: true
  },
  'admin/dashboard': {
    permissions: [{ entity: 'عضو', action: 'view' }],
    description: 'لوحة تحكم المدير'
  },
  'admin/statistics': {
    permissions: [{ entity: 'عضو', action: 'view' }],
    description: 'الإحصائيات'
  },
  'admin/notifications': {
    permissions: [{ entity: 'عضو', action: 'update' }],
    description: 'تعديل الاشعارات'
  },
  'admin/sections': {
    permissions: [{ entity: 'عضو', action: 'view' }],
    description: 'اقسام التطبيق'
  },
  'admin/branches': {
    permissions: [{ entity: 'عضو', action: 'view' }],
    description: 'إدارة الأعضاء'
  },
};

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
        path: 'contact-us',
        element: (
          <SuspenseLoader>
            <ContactUsPage />
          </SuspenseLoader>
        ),
      },
      {
        path: 'test',
        element: (
          <SuspenseLoader>
            <ErrorPage />
          </SuspenseLoader>
        ),
      },
      {
        element: <AuthLayout />,
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
          {
            path: 'forget',
            element: (
              <SuspenseLoader>
                <ForgetPasswordPage />
              </SuspenseLoader>
            ),
          },
          {
            path: 'reset-password/:token',
            element: (
              <SuspenseLoader>
                <ResetPasswordPage />
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
            path: 'advertisement',
            element: (
              <SuspenseLoader>
                <AdvertisementPage />
              </SuspenseLoader>
            ),
            handle: routePermissions.advertisement
          },
          {
            path: 'advertisement-details/:id',
            element: (
              <SuspenseLoader>
                <AdDetailsPage />
              </SuspenseLoader>
            ),
            handle: routePermissions['advertisement-details/:id']
          },
                    {
            path: 'advertisement-edit/:id',
            element: (
              <SuspenseLoader>
                <EditAdPage />
              </SuspenseLoader>
            ),
            handle: routePermissions['advertisement-edit/:id']
          },
          {
            path: 'financial',
            element: (
              <SuspenseLoader>
                <FinancialPage />
              </SuspenseLoader>
            ),
            handle: routePermissions.financial
          },
          {
            path: 'financial/:id',
            element: (
              <SuspenseLoader>
                <TransactionDetailsPage />
              </SuspenseLoader>
            ),
            handle: routePermissions['financial/:id']
          },
          {
            path: 'family-tree/:branch',
            element: (
              <SuspenseLoader>
                <FamilyTreePage />
              </SuspenseLoader>
            ),
            handle: routePermissions['family-tree/:branch']
          },
          {
            path: 'nested-tree/:memberId',
            element: (
              <SuspenseLoader>
                <NestedTreePage />
              </SuspenseLoader>
            ),
            handle: routePermissions['nested-tree/:memberId']
          },
          {
            path: 'albums',
            element: (
              <SuspenseLoader>
                <AlbumsPage />
              </SuspenseLoader>
            ),
            handle: routePermissions.albums
          },
          {
            path: 'events',
            element: (
              <SuspenseLoader>
                <EventsPage />
              </SuspenseLoader>
            ),
            handle: routePermissions.events
          },
          {
            path: 'albums/:id',
            element: (
              <SuspenseLoader>
                <AlbumsDetailsPage />
              </SuspenseLoader>
            ),
            handle: routePermissions['albums/:id']
          },
          {
            path: 'admin',
            element: (
              <SuspenseLoader>
                <AdminPage />
              </SuspenseLoader>
            ),
            handle: {
              permissions: [{ entity: 'مستخدم', action: 'view' }],
              description: 'لوحة الإدارة'
            },
            children: [
              {
                path: 'users',
                element: (
                  <SuspenseLoader>
                    <UsersPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/users']
              },
              {
                path: 'users/:userId',
                element: (
                  <SuspenseLoader>
                    <EditUserPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/users/:userId']
              },
              {
                path: 'members',
                element: (
                  <SuspenseLoader>
                    <MembersPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/members']
              },
              {
                path: 'members/:memberId',
                element: (
                  <SuspenseLoader>
                    <MembersDeatilsPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/members/:memberId']
              },
                {
                path: 'branches',
                element: (
                  <SuspenseLoader>
                    <BranchesPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/members']
              },
              {
                path: 'roles-permissions',
                element: (
                  <SuspenseLoader>
                    <RolesPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/roles-permissions']
              },
              {
                path: 'dashboard',
                element: (
                  <SuspenseLoader>
                    <AdminDashboardPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/dashboard']
              },
              {
                path: 'sections',
                element: (
                  <SuspenseLoader>
                    <RolesPermissionsPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/sections']
              },
              {
                path: 'statistics',
                element: (
                  <SuspenseLoader>
                    <StatisticsPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/statistics']
              },
              {
                path: 'notifications',
                element: (
                  <SuspenseLoader>
                    <NotificationSettingsPage />
                  </SuspenseLoader>
                ),
                handle: routePermissions['admin/notifications']
              },
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