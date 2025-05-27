import { Outlet } from 'react-router-dom';
import TabBar from '../shared/TabBar';
import { useState } from 'react';
import MoreOptions from '../shared/MoreOptions';

const PublicLayout = () => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
    const handleMoreOptions = () => {
      setShowMoreOptions(!showMoreOptions)
    }

  return (
    <div className="public-layout">
        <Outlet />
        
      {showMoreOptions && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-16">
          <div className="bg-white rounded-lg w-full overflow-y-auto h-full">
            <MoreOptions setShowMoreOptions={handleMoreOptions} />
          </div>
        </div>
      )}
      <TabBar setShowMoreOptions={handleMoreOptions} />
    </div>
  );
};

export default PublicLayout;