import { Navigate, useLocation, useMatches } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { useGetAuthUserQuery } from '../store/api/baseApi';
import { useCheckPermissionMutation } from '../store/api/permissionApi';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();
  const matches = useMatches();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isSuccess, isError } = useGetAuthUserQuery();
  const [checkPermission] = useCheckPermissionMutation();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // الحصول على بيانات المسار الحالي
  const currentRoute = matches.find(match => match.pathname === location.pathname);
  const routeHandle = currentRoute?.handle as any;

  const requiredPermissions = routeHandle?.permissions || [];
  const requiresServerCheck = routeHandle?.requiresServerCheck || false;

  const authStatus = isSuccess ? true : isError ? false : isAuthenticated;
  const isAuthRoute = ['/login', '/register', '/forget', '/reset-password'].includes(location.pathname);

  useEffect(() => {
    const verifyPermissions = async () => {
      if (requiredPermissions.length === 0) {
        setHasAccess(true);
        return;
      }

      try {
        const results = await Promise.all(
          requiredPermissions.map((perm: any) =>
            checkPermission(perm).unwrap()
          )
        );

        setHasAccess(results.every(res => res.success));
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasAccess(false);
      }
    };

    verifyPermissions();
  }, [authStatus, requiredPermissions, requiresServerCheck]);

  if (isAuthRoute && authStatus) {
    return <Navigate to="/dashboard" replace />;
  }

  if (hasAccess === null) {
    return <> <LoadingSpinner /> </>;
  }

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;