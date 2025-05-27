import { useNavigate } from "react-router-dom";

interface SettingDropDownProps {
  user: {
    fname?: string;
    lname?: string;
    email?: string;
    role?: string;
    image?: string;
  } | null;
  onLogout: () => void;
  toggleProfileMenu: () => void;
}

const SettingDropDown = ({ user, onLogout, toggleProfileMenu }: SettingDropDownProps) => {
  let navigate = useNavigate()
    const handleNavigation = (path: string) => {
      toggleProfileMenu()
      navigate(path);
    };
  
  return (
    <div className="absolute left-0 mt-6 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="px-4 py-3 bg-gray-100">
        <p className="text-md font-medium text-primary">
          {user?.fname} {user?.lname}
        </p>
        <p className="text-sm text-gray-700 truncate">{user?.role}</p>
      </div>

      <div className="py-1">
        <button
          onClick={()=>handleNavigation('/profile')}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-gray-400 mx-2"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                clipRule="evenodd"
              />
            </svg>
            الملف الشخصي
          </div>
        </button>
      </div>

      <div className="py-1">
        <button
          onClick={onLogout}
          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-gray-400 mx-2"
            >
              <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                clipRule="evenodd"
              />
            </svg>
            تسجيل الخروج
          </div>
        </button>
      </div>
    </div>
  );
};

export default SettingDropDown;