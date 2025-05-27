import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { useGetAuthUserQuery } from '../store/api/baseApi';

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isSuccess, isError } = useGetAuthUserQuery();

  const authStatus = isSuccess ? true : isError ? false : isAuthenticated;
  const isLoginOrRegister = ['/login', '/register'].includes(location.pathname);

  if (isLoginOrRegister && authStatus) {
    return <Navigate to="/dashboard" />;
  }

  if (!isLoginOrRegister && !authStatus) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;