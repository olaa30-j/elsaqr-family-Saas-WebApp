import { Outlet } from 'react-router-dom';
import Footer from '../shared/Footer';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
      <Footer/>
    </div>
  );
};

export default AuthLayout;