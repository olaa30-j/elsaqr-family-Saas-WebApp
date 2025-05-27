import { Outlet } from 'react-router-dom';
// import { checkRoutePermissions } from '../../utils/permissions';
// import DefaultSidebar from '../shared/DefaultSidebar';
import Navbar from '../shared/Navbar';

const ProtectedLayout = () => {
  return (
    <div className="protected-layout">
      <Navbar />
      <div className="main-content">
        {/* <DefaultSidebar /> */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;