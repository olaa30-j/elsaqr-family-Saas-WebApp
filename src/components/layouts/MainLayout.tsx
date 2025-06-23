import { Outlet } from 'react-router-dom';
import Navbar from '../shared/Navbar';

const ProtectedLayout = () => {
  return (
    <div className="protected-layout">
      <Navbar />
      <div className="main-content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;